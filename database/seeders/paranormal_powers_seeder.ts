import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ParanormalPower from '#models/paranormal_power'

export default class extends BaseSeeder {
    async run() {
        const powers = [
            // PODERES GERAIS
            {
                name: 'Aprender Ritual',
                element: 'Varia',
                description: 'Através de uma conexão com as memórias de ocultistas do passado e os segredos das entidades, você aprende e pode conjurar um ritual de 1º círculo à sua escolha. Além disso, você pode substituir um ritual que já conhece por outro.',
                effects: {
                    main: 'A partir de 45% de NEX, quando escolhe este poder, você aprende um ritual de até 2º círculo e, a partir de 75% de NEX, aprende um ritual de até 3º círculo. Você pode escolher esse poder quantas vezes quiser, mas está sujeito ao limite de rituais conhecidos.',
                },
            },
            {
                name: 'Resistir a <Elemento>',
                element: 'Varia',
                description: 'Escolha entre Conhecimento, Energia, Morte ou Sangue.',
                effects: {
                    main: 'Você recebe resistência 10 contra esse elemento. Este poder conta como um poder do elemento escolhido.',
                    affinity: 'Aumenta a resistência para 20.',
                },
            },
            // PODERES DE CONHECIMENTO
            {
                name: 'Expansão de Conhecimento',
                element: 'Conhecimento',
                requirements: 'Conhecimento 1',
                description: 'Você se conecta com o Conhecimento do Outro Lado, rompendo os limites de sua compreensão.',
                effects: {
                    main: 'Você aprende um poder de classe que não pertença à sua classe (caso o poder possua pré-requisitos, você precisa preenchê-los).',
                    affinity: 'Você aprende um segundo poder de classe que não pertença à sua classe.',
                },
            },
            {
                name: 'Percepção Paranormal',
                element: 'Conhecimento',
                description: 'O Conhecimento sussurra em sua mente.',
                effects: {
                    main: 'Em cenas de investigação, sempre que fizer um teste para procurar pistas, você pode rolar novamente um dado com resultado menor que 10. Você deve aceitar a segunda rolagem, mesmo que seja menor que a primeira.',
                    affinity: 'Você pode rolar novamente até dois dados com resultado menor que 10.',
                },
            },
            {
                name: 'Precognição',
                element: 'Conhecimento',
                requirements: 'Conhecimento 1',
                description: 'Você possuí um “sexto sentido” que o avisa do perigo antes que ele aconteça.',
                effects: {
                    main: 'Você recebe +2 em Defesa e em testes de resistência.',
                    affinity: 'Você fica imune à condição desprevenido.',
                },
            },
            {
                name: 'Sensitivo',
                element: 'Conhecimento',
                description: 'Você consegue sentir as emoções e intenções de outros seres, como medo, raiva ou malícia.',
                effects: {
                    main: 'Recebe +5 em testes de Diplomacia, Intimidação e Intuição.',
                    affinity: 'Quando você faz um teste oposto usando uma dessas perícias, o oponente sofre –1d.',
                },
            },
            {
                name: 'Visão do Oculto',
                element: 'Conhecimento',
                description: 'Você não enxerga mais pelos olhos, mas sim pela percepção do Conhecimento em sua mente.',
                effects: {
                    main: 'Você recebe +5 em testes de Percepção e enxerga no escuro.',
                    affinity: 'Você ignora camuflagem.',
                },
            },
            // PODERES DE ENERGIA
            {
                name: 'Afortunado',
                element: 'Energia',
                description: 'A Energia considera resultados medíocres entediantes.',
                effects: {
                    main: 'Uma vez por rolagem, você pode rolar novamente um resultado 1 em qualquer dado que não seja d20.',
                    affinity: 'Além disso, uma vez por teste, você pode rolar novamente um resultado 1 em d20.',
                },
            },
            {
                name: 'Campo Protetor',
                element: 'Energia',
                requirements: 'Energia 1',
                description: 'Você consegue gerar um campo de Energia que o protege de perigos.',
                effects: {
                    main: 'Quando usa a ação esquiva, você pode gastar 1 PE para receber +5 em Defesa.',
                    affinity: 'Quando usa este poder, você também recebe +5 em Reflexo e, até o início de seu próximo turno, se passar em um teste de Reflexo que reduziria o dano à metade, em vez disso não sofre nenhum dano.',
                },
            },
            {
                name: 'Causalidade Fortuita',
                element: 'Energia',
                description: 'A Energia o conduz rumo a descobertas.',
                effects: {
                    main: 'Em cenas de investigação, a DT para procurar pistas diminui em –5 para você até você encontrar uma pista.',
                    affinity: 'A DT para procurar pistas sempre diminui em –5 para você.',
                },
            },
            {
                name: 'Golpe de Sorte',
                element: 'Energia',
                requirements: 'Energia 1',
                description: '(Poder focado em precisão e impacto crítico).',
                effects: {
                    main: 'Seus ataques recebem +1 na margem de ameaça.',
                    affinity: 'Seus ataques recebem +1 no multiplicador de crítico.',
                },
            },
            {
                name: 'Manipular Entropia',
                element: 'Energia',
                requirements: 'Energia 1',
                description: 'Nada diverte mais a Energia do que a possibilidade de um desastre ainda maior.',
                effects: {
                    main: 'Quando outro ser em alcance curto faz um teste de perícia, você pode gastar 2 PE para fazê-lo rolar novamente um dos dados desse teste.',
                    affinity: 'O alvo rola novamente todos os dados que você escolher.',
                },
            },
            // PODERES DE MORTE
            {
                name: 'Encarar a Morte',
                element: 'Morte',
                description: 'Sua conexão com a Morte faz com que você não hesite em situações de perigo.',
                effects: {
                    main: 'Durante cenas de ação, seu limite de gasto de PE aumenta em +1 (isso não afeta a DT de seus efeitos).',
                    affinity: 'Durante cenas de ação, seu limite de gasto de PE aumenta em +2 (para um total de +3).',
                },
            },
            {
                name: 'Escapar da Morte',
                element: 'Morte',
                requirements: 'Morte 1',
                description: 'A Morte tem um interesse especial em sua caminhada.',
                effects: {
                    main: 'Uma vez por cena, quando receber dano que o deixaria com 0 PV, você fica com 1 PV. Não funciona em caso de dano massivo.',
                    affinity: 'Em vez do normal, você evita completamente o dano. Em caso de dano massivo, você fica com 1 PV.',
                },
            },
            {
                name: 'Potencial Aprimorado',
                element: 'Morte',
                description: 'A Morte lhe concede potencial latente de momentos roubados de outro lugar.',
                effects: {
                    main: 'Você recebe +1 ponto de esforço por NEX. Quando sobe de NEX, os PE que recebe por este poder aumentam de acordo.',
                    affinity: 'Você recebe +1 PE adicional por NEX (para um total de +2 PE por NEX).',
                },
            },
            {
                name: 'Potencial Reaproveitado',
                element: 'Morte',
                description: 'Você absorve os momentos desperdiçados de outros seres.',
                effects: {
                    main: 'Uma vez por rodada, quando passa num teste de resistência, você ganha 2 PE temporários cumulativos. Os pontos desaparecem no final da cena.',
                    affinity: 'Você ganha 3 PE temporários, em vez de 2.',
                },
            },
            {
                name: 'Surto Temporal',
                element: 'Morte',
                requirements: 'Morte 2',
                description: 'A sua percepção temporal se torna distorcida e espiralizada, fazendo com que a noção de passagem do tempo nunca mais seja a mesma para você.',
                effects: {
                    main: 'Uma vez por cena, durante seu turno, você pode gastar 3 PE para realizar uma ação padrão adicional.',
                    affinity: 'Em vez de uma vez por cena, você pode usar este poder uma vez por turno.',
                },
            },
            // PODERES DE SANGUE
            {
                name: 'Anatomia Insana',
                element: 'Sangue',
                requirements: 'Sangue 2',
                description: 'O seu corpo é transfigurado e parece desenvolver um instinto próprio separado da sua consciência.',
                effects: {
                    main: 'Você tem 50% de chance (resultado par em 1d4) de ignorar o dano adicional de um acerto crítico ou ataque furtivo.',
                    affinity: 'Você é imune aos efeitos de acertos críticos e ataques furtivos.',
                },
            },
            {
                name: 'Arma de Sangue',
                element: 'Sangue',
                description: 'O Sangue devora parte de seu corpo e se manifesta como parte de você.',
                effects: {
                    main: 'Você pode gastar uma ação de movimento e 2 PE para produzir garras, chifres ou uma lâmina de sangue cristalizado que brota de seu antebraço. Causa 1d6 pontos de dano de Sangue. Uma vez por turno, quando usa a ação agredir, pode gastar 1 PE para fazer um ataque adicional.',
                    affinity: 'A arma se torna parte permanente de você e causa 1d10 pontos de dano de Sangue.',
                },
            },
            {
                name: 'Sangue de Ferro',
                element: 'Sangue',
                description: 'O seu sangue flui de forma paranormal e agressiva, concedendo vigor não natural.',
                effects: {
                    main: 'Você recebe +2 pontos de vida por NEX. Quando sobe de NEX, os PV que recebe por este poder aumentam de acordo.',
                    affinity: 'Você recebe +5 em Fortitude e se torna imune a venenos e doenças.',
                },
            },
            {
                name: 'Sangue Fervente',
                element: 'Sangue',
                requirements: 'Sangue 2',
                description: 'A intensidade da dor desperta em você sentimentos bestiais e prazerosos que você nem imaginava que existiam.',
                effects: {
                    main: 'While estiver machucado, você recebe +1 em Agilidade ou Força, à sua escolha.',
                    affinity: 'O bônus que você recebe em Agilidade ou Força aumenta para +2.',
                },
            },
            {
                name: 'Sangue Vivo',
                element: 'Sangue',
                requirements: 'Sangue 1',
                description: 'A carnificina não pode parar, o Sangue precisa continuar fluindo.',
                effects: {
                    main: 'Na primeira vez que ficar machucado durante uma cena, você recebe cura acelerada 2. Nunca cura acima da metade dos PV máximos.',
                    affinity: 'A cura acelerada aumenta para 5.',
                },
            },
        ]

        for (const power of powers) {
            await ParanormalPower.updateOrCreate(
                { name: power.name },
                power
            )
        }

        console.log(`✓ Seeded ${powers.length} paranormal powers`)
    }
}
