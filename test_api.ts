import axios from 'axios'

async function test() {
  try {
    const response = await axios.post('http://localhost:3333/api/characters/1/rolls', {
      action: 'Ritual: Buff Test',
      roll_expression: '1d20+5',
      result: 15,
      is_critical: false,
      is_fail: false,
      is_gm: false,
      diceValues: [10]
    }, {
      headers: {
        // Need auth cookie?
      }
    })
    console.log('Response:', response.status)
  } catch (err) {
    console.log('Error Status:', err.response?.status)
    console.log('Error Data:', JSON.stringify(err.response?.data, null, 2))
  }
}

test()
