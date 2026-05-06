import Ritual from '#models/ritual'

const ritual = await Ritual.query().where('name', 'Aprimorar Mente').first()
if (ritual) {
  console.log('ID:', ritual.id)
  console.log('Name:', ritual.name)
  console.log('Element:', ritual.element)
  console.log('Circle:', ritual.circle)
  console.log('Discente:', ritual.discente)
  console.log('Verdadeiro:', ritual.verdadeiro)
} else {
  console.log('Ritual not found')
}
process.exit(0)
