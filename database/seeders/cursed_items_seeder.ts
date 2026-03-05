import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
    async run() {
        await db.from('cursed_items').delete()

        const items = [
            // SANGUE (Elemento 1)
            {
                name: 'Coração Pulsante',
                element: 1,
                category: 2,
                item_type: 'Acessório',
                spaces: 1,
                description: 'Um coração humano ainda pulsando, envolto em veias que se prendem ao portador.',
                benefits: JSON.stringify(['+2 em Fortitude', 'Gaste 2 PE para receber 10 PV temporários']),
                curses: JSON.stringify(['-1d20 em testes de Diplomacia', 'Sente fome constante']),
            },
            {
                name: 'Dedo de Sangue',
                element: 1,
                category: 2,
                item_type: 'Acessório',
                spaces: 0,
                description: 'Um dedo decepado que aponta para a dor alheia.',
                benefits: JSON.stringify(['+2 em Luta', 'Aumenta margem de ameaça em +1']),
                curses: JSON.stringify(['Sempre que sofrer dano, sofre +1']),
            },
            {
                name: 'Colete de Pele',
                element: 1,
                category: 3,
                item_type: 'Vestimenta',
                spaces: 2,
                description: 'Um colete feito de pele humana que parece se fundir ao corpo.',
                benefits: JSON.stringify(['+2 de Defesa', 'RD 5 contra Impacto']),
                curses: JSON.stringify(['Aparência perturbadora (-5 em testes Sociais)']),
            },

            // MORTE (Elemento 4)
            {
                name: 'Casaco de Lodo',
                element: 4,
                category: 2,
                item_type: 'Vestimenta',
                spaces: 2,
                description: 'Um sobretudo negro coberto por um lodo que nunca seca.',
                benefits: JSON.stringify(['Cura Acelerada 2', 'RD 5 contra Morte']),
                curses: JSON.stringify(['Envelhece 1 ano por semana de uso', '-2 em Agilidade']),
            },
            {
                name: 'Crânio Espiral',
                element: 4,
                category: 3,
                item_type: 'Acessório',
                spaces: 1,
                description: 'Um crânio com padrões de espiral esculpidos no osso.',
                benefits: JSON.stringify(['+1 ação padrão por cena (gasto 3 PE)', '+5 em Ocultismo']),
                curses: JSON.stringify(['-2 em Vigor', 'Pode ouvir sussurros do Outro Lado']),
            },
            {
                name: 'Ampulheta de Lodo',
                element: 4,
                category: 2,
                item_type: 'Acessório',
                spaces: 1,
                description: 'A areia flui para cima nesta ampulheta perturbadora.',
                benefits: JSON.stringify(['Pode re-rolar um teste de resistência por cena', 'Gaste 2 PE para dar -1d20 em um inimigo']),
                curses: JSON.stringify(['Seus cabelos ficam brancos precocemente']),
            },

            // CONHECIMENTO (Elemento 2)
            {
                name: 'Máscara de Vidro',
                element: 2,
                category: 2,
                item_type: 'Acessório',
                spaces: 1,
                description: 'Uma máscara transparente que revela a verdade por trás da mentira.',
                benefits: JSON.stringify(['+5 em Percepção e Intuição', 'Imunidade a Ilusões']),
                curses: JSON.stringify(['Sente a dor emocional de todos ao redor', 'Olhar fixo e perturbador']),
            },
            {
                name: 'Pena dos Escribas',
                element: 2,
                category: 2,
                item_type: 'Acessório',
                spaces: 0,
                description: 'Uma pena que escreve sozinha em línguas mortas.',
                benefits: JSON.stringify(['+5 em Investigação e Religião', 'Traduz qualquer língua escrita']),
                curses: JSON.stringify(['Suas mãos estão sempre manchadas de tinta preta']),
            },
            {
                name: 'Lente da Verdade',
                element: 2,
                category: 2,
                item_type: 'Acessório',
                spaces: 1,
                description: 'Um monóculo dourado que foca nas falhas do mundo.',
                benefits: JSON.stringify(['Enxerga através de portas e paredes de até 10cm', 'Identifica itens paranormais']),
                curses: JSON.stringify(['Luz forte causa ofuscamento']),
            },

            // ENERGIA (Elemento 3)
            {
                name: 'Relógio do Caos',
                element: 3,
                category: 2,
                item_type: 'Acessório',
                spaces: 1,
                description: 'Os ponteiros giram aleatoriamente neste relógio de bolso.',
                benefits: JSON.stringify(['+5 em Iniciativa', 'Uma vez por rodada, re-rola um resultado 1 em qualquer dado']),
                curses: JSON.stringify(['-5 em Furtividade (emite brilho e sons aleatórios)']),
            },
            {
                name: 'Manoplas Cinéticas',
                element: 3,
                category: 2,
                item_type: 'Acessório',
                spaces: 1,
                description: 'Manoplas que vibram com energia instável.',
                benefits: JSON.stringify(['Ataques desarmados causam +1d8 de Energia', '+2 em Atletismo']),
                curses: JSON.stringify(['Pode receber um choque aleatório (1d4 de dano)']),
            },
            {
                name: 'Bateria Infinita',
                element: 3,
                category: 3,
                item_type: 'Acessório',
                spaces: 2,
                description: 'Uma bateria que solta faíscas verdes constantemente.',
                benefits: JSON.stringify(['+10 PE máximos', 'Dispositivos eletrônicos nunca descarregam']),
                curses: JSON.stringify(['RD 0 contra Energia (sofre dano dobrado)']),
            },

            // MEDO (Elemento 5)
            {
                name: 'Olho do Medo',
                element: 5,
                category: 4,
                item_type: 'Acessório',
                spaces: 1,
                description: 'Um olho preservado em formol que parece seguir seus movimentos.',
                benefits: JSON.stringify(['+5 em testes de Intimidação', 'Causa a condição Abalado em área']),
                curses: JSON.stringify(['-5 em testes de Vontade', 'Pesadelos constantes (não recupera SAN ao dormir)']),
            },
            // VARIA / OUTROS (Elemento 0)
            {
                name: 'Cinzas de Outrora',
                element: 0,
                category: 2,
                item_type: 'Consumível',
                spaces: 1,
                description: 'Restos de algo que nunca existiu.',
                benefits: JSON.stringify(['Recupera 5d10 PV ou PE (uso único)', 'Pode ser usado para rituais']),
                curses: JSON.stringify(['Esquecimento de memórias felizes']),
            },
        ]

        const now = new Date().toISOString()
        const finalItems = items.map(item => ({
            ...item,
            created_at: now,
            updated_at: now
        }))

        await db.table('cursed_items').insert(finalItems)
        console.log(`✓ Seeded ${items.length} cursed items with categories`)
    }
}
