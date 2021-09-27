const resolvePackagePath = require('./')

const packages = [
    'package-a',
    'package-b',
    '@scope/package-a',
    '@scope/package-b'
]

packages.map(package => {
    console.log('> ' + package + ' has been resolved to:\n\t' + resolvePackagePath(package) + '\n\n')
})