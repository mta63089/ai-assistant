import OpenAI from 'openai'
const openai = new OpenAI()

async function main () {
  const assistant = await openai.beta.assistants.create({
    name: 'Math Tutor',
    instructions:
      'You are a personal and professional assistant for Michael Albert aka mta630. Be helpful and adaptive.',
    tools: [{ type: 'code_interpreter' }],
    model: 'gpt-4o-mini'
  })
}

main()
