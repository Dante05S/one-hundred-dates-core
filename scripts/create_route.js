const fs = require('fs')

const PATH_ROUTES_INDEX = 'src/routes/index.ts'
const PATH_ROUTES = 'src/routes/api'
const PATH_CONTROLLERS = 'src/controllers'
const PATH_SERVICES = 'src/services'
const PATH_REPOSITORIES = 'src/repositories'

const toSnakeCase = (name) => {
  // Remove upper case characters for _
  let formatName = name.replace(/([a-z])([A-Z])/g, '$1-$2')

  // Remove - for _
  formatName = formatName.replace(/_/g, '-').toLowerCase()

  // Remove initial a final _
  formatName = formatName.replace(/^-+|-+$/g, '')

  // Remove accents, swap ñ for n, etc
  const from = 'ãàáäâáèéëêìíïîõòóöôùúüûñç'
  const to = 'aaaaaeeeeeiiiiooooouuuunc'
  for (let i = 0, l = from.length; i < l; i++) {
    formatName = formatName.replace(
      new RegExp(from.charAt(i), 'g'),
      to.charAt(i)
    )
  }

  return formatName
}

const toCamelCase = (string) => {
  return string.replace(/[^a-zA-Z0-9]+(.)/g, (match, char) =>
    char.toUpperCase()
  )
}

const toPascalCase = (string) => {
  return string
    .split('_') // Divide el string en palabras usando guiones bajos como separadores
    .filter((word) => word.length > 0) // Filtra las palabras vacías
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palabra
    .join('') // Une las palabras sin espacios
}

const editFile = (file, indexEdit, newCode) => {
  return file.slice(0, indexEdit) + '\n' + newCode + file.slice(indexEdit)
}

const findLastIndexCode = (file, regex) => {
  const matches = file.match(regex)
  const lastMatch = matches[matches.length - 1]
  return file.lastIndexOf(lastMatch) + lastMatch.length
}

const editRouteIndex = (file, codeImport, routerUse) => {
  let newFile = file

  // Find the last require
  let regex = /import (?:[\w\s]*from)?\s*('.\/api\/\w+')/g
  let lastIndex = findLastIndexCode(newFile, regex)
  newFile = editFile(newFile, lastIndex, codeImport)

  // Find the last router.use
  regex = /router\.use\((['"]).+?\1,\s*.+?\)/g
  lastIndex = findLastIndexCode(newFile, regex)
  newFile = editFile(newFile, lastIndex, routerUse)

  fs.writeFile(PATH_ROUTES_INDEX, newFile, 'utf8', (error) => {
    if (error) {
      console.error('Error al escribir en el archivo:', error)
    }
  })
}

const readRouteIndex = (fileName) => {
  fs.readFile(PATH_ROUTES_INDEX, 'utf8', (error, data) => {
    if (error) {
      console.error('Error al leer el archivo:', error)
      return
    }
    // Format code import route
    const varRouter = `${toCamelCase(fileName)}Router`
    const require = `'./api/${fileName}'`
    const codeImport = `import ${varRouter} from ${require}`

    // Format code use route
    const routerUse = `router.use('/${fileName.replace(
      '_',
      '-'
    )}', ${varRouter})`

    editRouteIndex(data, codeImport, routerUse)
  })
}

const createRouteFile = (fileName) => {
  const varController = `${toCamelCase(fileName)}Controller`
  const require = `'../../controllers/${fileName}'`
  const codeImport = `import ${varController} from ${require}`

  const newFileRoute =
    '/* eslint-disable @typescript-eslint/unbound-method */' +
    '\n' +
    "import { Router } from 'express'" +
    '\n' +
    codeImport +
    '\n' +
    '\n' +
    'const router = Router()' +
    '\n' +
    '\n' +
    `router.get('/', ${varController}.index)` +
    '\n' +
    '\n' +
    'export default router' +
    '\n'

  fs.writeFile(
    `${PATH_ROUTES}/${fileName}.ts`,
    newFileRoute,
    'utf8',
    (error) => {
      if (error) {
        console.error('Error al escribir en el archivo:', error)
      }
    }
  )
}

const createControllerFile = (fileName) => {
  const pascalCase = toPascalCase(fileName)
  const classService = `${pascalCase}Service`
  const classController = `${pascalCase}Controller`
  const varController = `${toCamelCase(fileName)}Controller`

  const require = `'../services/${fileName}.service'`
  const codeImport = `import ${classService} from ${require}`

  const newFileController =
    "import { type ResponseController } from '../types/response-controller'" +
    '\n' +
    "import { Controller } from '../decorators/Controller'" +
    '\n' +
    codeImport +
    '\n' +
    '\n' +
    `interface I${classController} {` +
    '\n' +
    `  index: () => ResponseController<{ msg: string }>` +
    '\n' +
    '}' +
    '\n' +
    '\n' +
    '@Controller()' +
    '\n' +
    `class ${classController} implements I${classController} {` +
    '\n' +
    '  public index(): ResponseController<{ msg: string }> {' +
    '\n' +
    `    const service = new ${classService}()` +
    '\n' +
    '    const data = service.index()' +
    '\n' +
    `    return [data, 'Get data ${fileName.replace('_', '-')} successfully']` +
    '\n' +
    '  }' +
    '\n' +
    '}' +
    '\n' +
    '\n' +
    `const ${varController} = new ${classController}()` +
    '\n' +
    `export default ${varController}` +
    '\n'

  fs.writeFile(
    `${PATH_CONTROLLERS}/${fileName}.ts`,
    newFileController,
    'utf8',
    (error) => {
      if (error) {
        console.error('Error al escribir en el archivo:', error)
      }
    }
  )
}

const createServiceFile = (fileName, withRepository) => {
  const pascalCase = toPascalCase(fileName)
  const classService = `${pascalCase}Service`

  const contructor =
    '  constructor() {' +
    '\n' +
    `    super(${pascalCase}Repository)` +
    '\n' +
    '  }' +
    '\n' +
    '\n'

  const newFileService =
    "import Service, { type IService } from '.'" +
    '\n' +
    `import { type ${pascalCase} } from '../database/entity/${pascalCase}'` +
    '\n' +
    `import { ${pascalCase}Repository } from '../repositories/${fileName}.repository'` +
    '\n' +
    '\n' +
    `interface I${classService} extends IService<${pascalCase}> {` +
    '\n' +
    '  index: () => { msg: string }' +
    '\n' +
    '}' +
    '\n' +
    '\n' +
    `class ${classService}` +
    '\n' +
    `  extends Service<${pascalCase}, typeof ${pascalCase}Repository>` +
    '\n' +
    `  implements I${classService}` +
    '\n' +
    '{' +
    '\n' +
    contructor +
    '  public index(): { msg: string } {' +
    '\n' +
    `    return { msg: 'Data ${classService}' }` +
    '\n' +
    '  }' +
    '\n' +
    '}' +
    '\n' +
    '\n' +
    `export default ${classService}` +
    '\n'

  fs.writeFile(
    `${PATH_SERVICES}/${fileName}.service.ts`,
    newFileService,
    'utf8',
    (error) => {
      if (error) {
        console.error('Error al escribir en el archivo:', error)
      }
    }
  )
}

const createRepositoryFile = (fileName) => {
  const pascalCase = toPascalCase(fileName)
  const classRepository = `${pascalCase}Repository`

  const newFileRepository =
    "import { AppDataSource } from '../database/data-source'" +
    '\n' +
    `import { ${pascalCase} } from '../database/entity/${pascalCase}'` +
    '\n' +
    '\n' +
    `export const ${classRepository} =` +
    '\n' +
    `  AppDataSource.getRepository(${pascalCase}).extend({})` +
    '\n'
  fs.writeFile(
    `${PATH_REPOSITORIES}/${fileName}.repository.ts`,
    newFileRepository,
    'utf8',
    (error) => {
      if (error) {
        console.error('Error al escribir en el archivo:', error)
      }
    }
  )
}

const main = () => {
  try {
    const routeName = process.argv[2]
    const param = process.argv[3]
    if (!routeName) throw new Error('The route name argument is required')
    if (param && param.toLowerCase() !== 'wr') {
      throw new Error(`
        The param ${param} don't exist. These are the parameters that exist:
          - wr: Generate the route but without repository
      `)
    }

    const fileName = toSnakeCase(routeName)

    readRouteIndex(fileName)
    createRouteFile(fileName)
    createControllerFile(fileName)
    createServiceFile(fileName, param !== 'wr')
    createRepositoryFile(fileName)

    console.log(
      `Route created successfully!!! The route's name is ${fileName.replace(
        '_',
        '-'
      )}`
    )
  } catch (e) {
    console.error(e)
  }
}

main()