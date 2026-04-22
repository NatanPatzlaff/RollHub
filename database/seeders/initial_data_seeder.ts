import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Class from '#models/class'
import Origin from '#models/origin'
import ClassProgression from '#models/class_progression'

export default class extends BaseSeeder {
  async run() {
    // 1. Classes
    const classes = await Class.updateOrCreateMany('name', [
      {
        name: 'Combatente',
        description: 'Especialista em combate direto e resistência.',
        baseHp: 20,
        hpPerLevel: 4,
        hpAttribute: 'vigor',
        basePe: 2,
        pePerLevel: 2,
        peAttribute: 'presence',
        baseSanity: 12,
        sanityPerLevel: 3,
        proficiencies: 'Armas simples, armas táticas e proteções leves',
        trainedSkillsRules:
          'Luta ou Pontaria, Fortitude ou Reflexos, e mais um número de perícias igual a 1 + Intelecto',
      },
      {
        name: 'Ocultista',
        description: 'Estudioso do paranormal e conjurador de rituais.',
        baseHp: 12,
        hpPerLevel: 2,
        hpAttribute: 'vigor',
        basePe: 4,
        pePerLevel: 4,
        peAttribute: 'presence',
        baseSanity: 20,
        sanityPerLevel: 5,
        proficiencies: 'Armas simples',
        trainedSkillsRules:
          'Ocultismo e Vontade e mais um número de perícias igual a 3 + Intelecto',
      },
      {
        name: 'Especialista',
        description: 'Mestre em perícias e suporte tático.',
        baseHp: 16,
        hpPerLevel: 3,
        hpAttribute: 'vigor',
        basePe: 3,
        pePerLevel: 3,
        peAttribute: 'presence',
        baseSanity: 16,
        sanityPerLevel: 4,
        proficiencies: 'Armas simples e proteções leves',
        trainedSkillsRules: 'Um número de perícias igual a 7 + Intelecto',
      },
      {
        name: 'Mundano',
        description:
          'Uma pessoa comum sem treinamento da Ordem. Focado em histórias de suspense, terror e sobrevivência, onde a fragilidade humana é o centro da narrativa.',
        baseHp: 8,
        hpPerLevel: 0,
        hpAttribute: 'vigor',
        basePe: 1,
        pePerLevel: 0,
        peAttribute: 'presence',
        baseSanity: 8,
        sanityPerLevel: 0,
        proficiencies: 'Armas simples',
        trainedSkillsRules: '1 + Intelecto (além das perícias da Origem)',
      },
    ])

    // 1.5 Class Progressions (Aumento de Atributo)
    const attributeIncreaseLevels = [20, 50, 80, 95]

    for (const cls of classes) {
      for (const nex of attributeIncreaseLevels) {
        await ClassProgression.updateOrCreate(
          { classId: cls.id, nex, title: 'Aumento de Atributo' },
          {
            classId: cls.id,
            nex,
            title: 'Aumento de Atributo',
            description: 'Você pode aumentar um atributo em +1 (limite 5).',
            type: 'ATTRIBUTE_BUFF',
            effects: { attribute_points: 1 },
          }
        )
      }
    }

    // 2. Origins (Complete data from source material)
    await Origin.updateOrCreateMany('name', [
      {
        name: 'Acadêmico',
        description:
          'Você era um pesquisador ou professor universitário. De forma proposital ou não, seus estudos tocaram em assuntos misteriosos e chamaram a atenção da Ordo Realitas.',
        trainedSkills: ['Ciências', 'Investigação'],
        abilityName: 'Saber é Poder',
        abilityDescription:
          'Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.',
      },
      {
        name: 'Agente de Saúde',
        description:
          'Você era um profissional da saúde como um enfermeiro, farmacêutico, médico, psicólogo ou socorrista, treinado no atendimento e cuidado de pessoas. Você pode ter sido surpreendido por um evento paranormal durante o trabalho ou mesmo cuidado de um agente da Ordem em uma emergência, que ficou surpreso com o quão bem você lidou com a situação.',
        trainedSkills: ['Intuição', 'Medicina'],
        abilityName: 'Técnica Medicinal',
        abilityDescription:
          'Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.',
      },
      {
        name: 'Amnésico',
        description:
          'Você perdeu a maior parte da memória. Sabe apenas o próprio nome, ou nem isso. Sua amnésia pode ser resultado de um trauma paranormal ou mesmo de um ritual. Talvez você tenha sido vítima de cultistas? Talvez você tenha sido um cultista? Seja como for, hoje a Ordem é a única família que conhece. Quem sabe, cumprindo missões, você descubra algo sobre seu passado.',
        trainedSkills: ['Duas à escolha do mestre'],
        abilityName: 'Vislumbres do Passado',
        abilityDescription:
          'Uma vez por sessão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares, que tenha encontrado antes de perder a memória. Se passar, recebe 1d4 PE temporários e, a critério do mestre, uma informação útil.',
      },
      {
        name: 'Artista',
        description:
          'Você era um ator, músico, escritor, dançarino, influenciador... Seu trabalho pode ter sido inspirado por uma experiência paranormal do passado e o que o público acha que é pura criatividade, a Ordem sabe que tem um lado mais sombrio.',
        trainedSkills: ['Artes', 'Enganação'],
        abilityName: 'Magnum Opus',
        abilityDescription:
          'Você é famoso por uma de suas obras. Uma vez por missão, pode determinar que um personagem envolvido em uma cena de interação o reconheça. Você recebe +5 em testes de Presença e de perícias baseadas em Presença contra aquele personagem. A critério do mestre, pode receber esses bônus em outras situações nas quais seria reconhecido.',
      },
      {
        name: 'Atleta',
        description:
          'Você competia em um esporte individual ou por equipe, como natação ou futebol. Seu alto desempenho pode ser fruto de alguma influência paranormal que nem mesmo você conhecia ou você pode ter se envolvido em algum evento paranormal em uma de suas competições.',
        trainedSkills: ['Acrobacia', 'Atletismo'],
        abilityName: '110%',
        abilityDescription:
          'Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria) você pode gastar 2 PE para receber +5 nesse teste.',
      },
      {
        name: 'Chef',
        description:
          'Você é um cozinheiro amador ou profissional. Talvez trabalhasse em um restaurante, talvez simplesmente gostasse de cozinhar para a família e amigos. Como sua comida fez com que você se envolvesse com o paranormal? Ninguém sabe. Mas os outros agentes adoram quando você vai para a missão!',
        trainedSkills: ['Fortitude', 'Profissão'],
        abilityName: 'Ingrediente Secreto',
        abilityDescription:
          'Em cenas de interlúdio, você pode fazer a ação alimentar-se para cozinhar um prato especial. Você, e todos os membros do grupo que fizeram a ação alimentar-se, recebem o benefício de dois pratos (caso o mesmo benefício seja escolhido duas vezes, seus efeitos se acumulam).',
      },
      {
        name: 'Cientista Forense',
        description:
          'Você trabalhava coletando provas para a resolução de crimes, seja para a polícia, seja para uma empresa privada de Investigação. Usava métodos e técnicas adquiridos através de uma graduação em uma área científica ou médica, além de cursos específicos. Recrutado para a Ordem por seus conhecimentos técnicos, seu trabalho não mudou muito - mas o tipo de crime que você investiga, sim.',
        trainedSkills: ['Ciências', 'Investigação'],
        abilityName: 'Investigação Científica',
        abilityDescription:
          'Uma vez por cena de investigação, você pode gastar uma ação livre para procurar pistas, usando Ciências no lugar da perícia que seria usada para tentar encontrar a pista em questão.',
      },
      {
        name: 'Criminoso',
        description:
          'Você vivia uma vida fora da lei, seja como mero batedor de carteiras, seja como membro de uma facção criminosa. Em algum momento, você se envolveu em um assunto da Ordem — talvez tenha roubado um item amaldiçoado? A organização, por sua vez, achou melhor recrutar seus talentos do que ter você como um estorvo.',
        trainedSkills: ['Crime', 'Furtividade'],
        abilityName: 'O Crime Compensa',
        abilityDescription:
          'No final de uma missão, escolha um item encontrado na missão. Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por patente.',
      },
      {
        name: 'Cultista Arrependido',
        description:
          'Você fez parte de um culto paranormal. Talvez fossem ignorantes iludidos, que acreditavam estar contatando entidades benevolentes. Talvez soubessem exatamente o que estavam fazendo. Seja como for, algo abriu seus olhos e agora você luta pelo lado certo — embora carregue para sempre traços de sua vida pregressa. Outros membros da Ordem podem desconfiar de sua conversão e você sabe que precisará se esforçar para conquistar a confiança de todos.',
        trainedSkills: ['Ocultismo', 'Religião'],
        abilityName: 'Traços do Outro Lado',
        abilityDescription:
          'Você possui um poder paranormal à sua escolha. Porém, começa o jogo com metade da Sanidade normal para sua classe.',
      },
      {
        name: 'Desgarrado',
        description:
          'Você não vivia de acordo com as normas da sociedade. Podia ser um eremita, uma pessoa em situação de rua ou simplesmente alguém que descobriu o Paranormal e abandonou sua rotina — sabendo o quão frágil era a existência humana, não conseguia simplesmente continuar indo para o trabalho todo o dia. De qualquer forma, a vida sem os confortos modernos o deixou mais forte.',
        trainedSkills: ['Fortitude', 'Sobrevivência'],
        abilityName: 'Calejado',
        abilityDescription: 'Você recebe +1 PV para cada 5% de NEX.',
      },
      {
        name: 'Dublê',
        description:
          'Você sempre combinou um gosto por alta velocidade, manobras ousadas e esportes radicais com uma total falta de noção do perigo. Sua busca incessante por adrenalina o fez seguir carreira de dublê, uma profissão que lhe permitiu enfrentar o risco das mais diversas formas. Agora à serviço da Ordem, você enfim enfrentará o Medo verdadeiro e poderá colocar sua coragem - e suas peripécias - à prova como nunca.',
        trainedSkills: ['Pilotagem', 'Reflexos'],
        abilityName: 'Destemido',
        abilityDescription:
          'Quando faz um teste de perícia para o qual uma falha terá como consequência direta dano ou uma condição negativa, você recebe +5 nesse teste.',
      },
      {
        name: 'Engenheiro',
        description:
          'Enquanto os acadêmicos estão preocupados com teorias, você coloca a mão na massa, seja como engenheiro profissional, seja como inventor de garagem. Provavelmente você criou algum dispositivo paranormal que chamou a atenção da Ordem.',
        trainedSkills: ['Profissão', 'Tecnologia'],
        abilityName: 'Ferramentas Favoritas',
        abilityDescription:
          'Um item a sua escolha (exceto armas) conta como uma categoria abaixo (por exemplo, um item de categoria II conta como categoria I para você).',
      },
      {
        name: 'Escritor',
        description:
          'Você ganhava a vida inventando mundos, pessoas e histórias - em outras palavras, escrevendo ficção. Em certo momento, seu trabalho tocou ou foi tocado pelo paranormal. Talvez as suas histórias tenham gerado Medo, talvez a inspiração para ela viesse do Outro Lado desde o início. Recrutado pela Ordem, você agora luta para que a vida real tenha o final feliz que seus livros não tiveram.',
        trainedSkills: ['Artes', 'Atualidades'],
        abilityName: 'Bagagem de Leitura',
        abilityDescription:
          'Por seu trabalho, você já leu - e aprendeu - de tudo um pouco. Uma vez por cena, pode gastar 2 PE para se tornar treinado em uma perícia qualquer até o fim da cena.',
      },
      {
        name: 'Executivo',
        description:
          'Você possuía um trabalho de escritório em uma grande empresa, banco ou corporação. Era um administrador, advogado, contador ou de qualquer outra profissão que lida com papelada e burocracia. Sua vida era bastante normal, até que você descobriu algo que não devia. Talvez o sucesso da empresa residisse em um ritual? Talvez toda a corporação fosse fachada para um culto e o presidente, um líder cultista envolvido com entidades paranormais? Após essa descoberta, você foi recrutado pela Ordem e trocou seu trabalho de escritório por missões de campo — hoje, sua vida é tudo, menos normal.',
        trainedSkills: ['Diplomacia', 'Profissão'],
        abilityName: 'Processo Otimizado',
        abilityDescription:
          'Sempre que faz um teste de perícia durante um teste estendido, ou uma ação para revisar documentos (físicos ou digitais), pode pagar 2 PE para receber +5 nesse teste.',
      },
      {
        name: 'Gaudério Abutre',
        description:
          'Você fez parte dos valorosos Gaudérios Abutres. Mesmo longe do motoclube, ainda segue o lema "A gente morre por quem a gente ama".',
        trainedSkills: ['Luta', 'Pilotagem'],
        abilityName: 'Fraternidade Gaudéria',
        abilityDescription:
          'Uma vez por rodada, quando um aliado adjacente é alvo de um ataque ou efeito, você pode gastar 1 PE para trocar de lugar com este aliado e se tornar o alvo deste ataque ou efeito. Se fizer isso, em seu próximo turno você recebe +2 em testes de ataque contra o agressor.',
      },
      {
        name: 'Ginasta',
        description:
          'Desde muito jovem, você passou a maior parte de sua vida em ginásios (ou talvez em antigos templos monásticos) praticando as mais difíceis acrobacias. Sua preparação foi árdua e dolorosa, mas aprimorou seu corpo, sua técnica e sua disciplina. Recrutado pela Ordo Realitas, essas se tornaram suas principais ferramentas para enfrentar o Outro lado. E com elas, você planeja fazer as criaturas paranormais sofrerem muito mais do que você sofreu em seus treinos.',
        trainedSkills: ['Acrobacia', 'Reflexos'],
        abilityName: 'Mobilidade Acrobática',
        abilityDescription: 'Você recebe +2 na Defesa e seu deslocamento aumenta em +3m.',
      },
      {
        name: 'Investigador',
        description:
          'Você era um investigador do governo, como um perito forense ou policial federal, ou privado, como um detetive particular. Pode ter tido contato com o Paranormal em algum caso ou ter sido recrutado pela Ordem por suas habilidades de resolução de mistérios.',
        trainedSkills: ['Investigação', 'Percepção'],
        abilityName: 'Faro para Pistas',
        abilityDescription:
          'Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste.',
      },
      {
        name: 'Jornalista',
        description:
          'Em um mundo de fofocas, escândalos, rumores e furos de reportagem, você, como um bom jornalista, tem um talento nato: Saber de informações antes dos outros, ou ao menos sabe onde procurá-las. Em algum momento essa sua curiosidade faz com que você chegasse em buracos muito mais fundos do que você se quer poderia imaginar, um fundo do poço onde não pode mais sair.',
        trainedSkills: ['Diplomacia', 'Enganação'],
        abilityName: 'Fofoca',
        abilityDescription:
          'Uma vez por sessão, quando você possui uma nova informação sobre o caso em que está investigando, pode gastar uma ação de interlúdio para procurar um algum caso reportado na mídia, alguma fofoca de um famoso ou algum boato que esteja circulando a respeito de algum assunto que auxilie a investigação. Antes de utilizar essa habilidade, fica a critério do mestre se essa habilidade é possível de quer utilizada ou não.',
      },
      {
        name: 'Lutador',
        description:
          'Você pratica uma arte marcial ou esporte de luta, ou cresceu em um bairro perigoso onde aprendeu briga de rua. Já quebrou muitos ossos, tanto seus quanto dos outros. Pode ter conhecido a Ordem após um torneio secreto envolvendo entidades do Outro Lado ou ter sido recrutado pela sua capacidade de luta.',
        trainedSkills: ['Luta', 'Reflexos'],
        abilityName: 'Mão Pesada',
        abilityDescription: 'Você recebe +2 em rolagens de dano com ataques corpo a corpo.',
      },
      {
        name: 'Magnata',
        description:
          'Você possui muito dinheiro ou patrimônio. Pode ser o herdeiro de uma família antiga ligada ao oculto, ter criado e vendido uma empresa e decidido usar sua riqueza para uma causa maior, ou ter ganho uma loteria após inadvertidamente escolher números amaldiçoados que formavam um ritual.',
        trainedSkills: ['Diplomacia', 'Pilotagem'],
        abilityName: 'Patrocinador da Ordem',
        abilityDescription: 'Seu limite de crédito é sempre considerado um acima do atual.',
      },
      {
        name: 'Mercenário',
        description:
          'Você é um soldado de aluguel, que trabalha sozinho ou como parte de alguma organização que vende serviços militares. Escoltas e assassinatos fizeram parte de sua rotina por tempo o suficiente para você se envolver em alguma situação com o Paranormal.',
        trainedSkills: ['Iniciativa', 'Intimidação'],
        abilityName: 'Posição de Combate',
        abilityDescription:
          'No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.',
      },
      {
        name: 'Militar',
        description:
          'Você serviu em uma força militar, como o exército ou a marinha. Passou muito tempo treinando com armas de fogo, até se tornar um perito no uso delas. Acostumado a obedecer ordens e partir em missões, está em casa na Ordo Realitas. O inimigo é diferente, mas um tiro bem dado continua resolvendo o problema.',
        trainedSkills: ['Pontaria', 'Tática'],
        abilityName: 'Para Bellum',
        abilityDescription: 'Você recebe +2 em rolagens de dano com armas de fogo.',
      },
      {
        name: 'Operário',
        description:
          'Pedreiro, industriário, operador de máquinas em uma fábrica... Você passou uma parte de sua vida em um emprego braçal, desempenhando atividades práticas que lhe deram uma visão pragmática do mundo. Sua rotina mundana, entretanto, foi confrontada de alguma forma pelo paranormal, e você não consegue mais esquecer tudo que viu sobre os mistérios do mundo.',
        trainedSkills: ['Fortitude', 'Profissão'],
        abilityName: 'Ferramenta de Trabalho',
        abilityDescription:
          'Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão (como uma marreta para um pedreiro). Você sabe usar a arma escolhida e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela.',
      },
      {
        name: 'Policial',
        description:
          'Você fez parte de uma força de segurança pública, civil ou militar. Em alguma patrulha ou chamado se deparou com um caso paranormal e sobreviveu para contar a história.',
        trainedSkills: ['Percepção', 'Pontaria'],
        abilityName: 'Patrulha',
        abilityDescription: 'Você recebe +2 em Defesa.',
      },
      {
        name: 'Professor',
        description:
          'Você leciona em uma escola ou universidade, ensinando ciências, artes ou outro campo do saber. Sua profissão é uma das mais nobres de todas e o colocou em contato com muitas pessoas e conhecimentos. Em algum momento, o colocou em contato também com o paranormal. Agora, trabalhando na Ordem, seus alunos são criaturas do Outro Lado, e você planeja reprovar todos esse ano.',
        trainedSkills: ['Ciências', 'Intuição'],
        abilityName: 'Aula de Campo',
        abilityDescription:
          'Você sabe extrair o melhor das pessoas. Uma vez por cena, pode gastar uma ação padrão e 2 PE para fornecer +1 em um atributo de outro personagem em alcance curto até o fim da cena.',
      },
      {
        name: 'Religioso',
        description:
          'Você é devoto ou sacerdote de uma fé. Independentemente da religião que pratica, se dedica a auxiliar as pessoas com problemas espirituais. A partir disso, teve contato com o paranormal, o que fez com que fosse convocado pela Ordem.',
        trainedSkills: ['Religião', 'Vontade'],
        abilityName: 'Acalentar',
        abilityDescription:
          'Você recebe +5 em testes de Religião para acalmar. Além disso, quando acalma uma pessoa, ela recebe um número de pontos de Sanidade igual a 1d6 + a sua Presença.',
      },
      {
        name: 'Revoltado',
        description:
          'Alguma coisa aconteceu em sua juventude que fez com que você se rebelasse contra o mundo ao seu redor. Talvez seus parentes tenham sido ausentes, por escolha ou por algum evento trágico, talvez outra perda tenha marcado seu coração. Qualquer que seja a razão, você possui iguais doses de rebeldia e independência e, acima de tudo, aprendeu a se virar sozinho. Recrutado pela Ordem, você luta por vingança - ou para que outros não passem pelo que você passou.',
        trainedSkills: ['Furtividade', 'Vontade'],
        abilityName: 'Antes Só',
        abilityDescription:
          'Você recebe +1 na Defesa, em testes de perícias e em seu limite de PE por turno se estiver sem nenhum aliado em alcance curto.',
      },
      {
        name: 'Servidor Público',
        description:
          'Você possuía carreira em um órgão do governo, lidando com burocracia e atendendo pessoas. Sua rotina foi quebrada quando você viu que o prefeito era um cultista ou que a câmara de vereadores se reunia à noite para realizar rituais. Quando os próprios representantes do povo estão dispostos a sacrificá-lo para entidades malignas, onde reside nossa esperança? Hoje, você sabe a resposta para essa pergunta: na Ordo Realitas.',
        trainedSkills: ['Intuição', 'Vontade'],
        abilityName: 'Espírito Cívico',
        abilityDescription:
          'Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido em +2.',
      },
      {
        name: 'Teórico da Conspiração',
        description:
          'A humanidade nunca pisou na lua. Reptilianos ocupam importantes cargos públicos. A Terra é plana... E secretamente governada pelos Illuminati. Você sabe isso tudo, pois investigou a fundo esses importantes assuntos. Quando sua pesquisa esbarrou no Paranormal, você foi recrutado. Na Ordem, sua loucura determinação será usada para um bom propósito.',
        trainedSkills: ['Investigação', 'Ocultismo'],
        abilityName: 'Eu Já Sabia',
        abilityDescription:
          'Você não se abala com entidades ou anomalias. Afinal, sempre soube que isso tudo existia. Você recebe resistência a dano mental igual ao seu Intelecto.',
      },
      {
        name: 'T.I.',
        description:
          'Programador, engenheiro de software ou simplesmente "o cara da T.I.", você tem treinamento e experiência para lidar com sistemas informatizados. Seu talento (ou curiosidade exagerada) chamou a atenção da Ordem.',
        trainedSkills: ['Investigação', 'Tecnologia'],
        abilityName: 'Motor de Busca',
        abilityDescription:
          'A critério do Mestre, sempre que tiver acesso à internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.',
      },
      {
        name: 'Trabalhador Rural',
        description:
          'Você trabalhava no campo ou em áreas isoladas, como fazendeiro, pescador, biólogo, veterinário... Você se acostumou com o convívio com a natureza e os animais e talvez tenha ouvido uma ou outra história de fantasmas ao redor da fogueira. Em algum momento da sua vida, porém, descobriu que muitas dessas histórias são verdadeiras.',
        trainedSkills: ['Adestramento', 'Sobrevivência'],
        abilityName: 'Desbravador',
        abilityDescription:
          'Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Além disso, você não sofre penalidade em deslocamento por terreno difícil.',
      },
      {
        name: 'Trambiqueiro',
        description:
          'Uma vida digna exige muito trabalho, então é melhor nem tentar. Você vivia de pequenos golpes, jogatina ilegal e falcatruas. Certo dia, enganou a pessoa errada; no dia seguinte, se viu servindo à Ordem. Pelo menos agora tem a chance de usar sua lábia para o bem.',
        trainedSkills: ['Crime', 'Enganação'],
        abilityName: 'Impostor',
        abilityDescription:
          'Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação.',
      },
      {
        name: 'Universitário',
        description:
          'Você era aluno de uma faculdade. Em sua rotina de estudos, provas e festas, acabou descobrindo algo — talvez um livro amaldiçoado na antiga biblioteca do campus? Por seu achado, foi convocado pela Ordem. Agora, estuda com mais afinco: nesse novo curso, ouviu dizer que as provas podem ser mortais.',
        trainedSkills: ['Atualidades', 'Investigação'],
        abilityName: 'Dedicação',
        abilityDescription:
          'Você recebe +1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%...). Além disso, seu limite de PE por turno aumenta em 1 (em NEX 5% seu limite é 2, em NEX 10% é 3 e assim por diante; isso não afeta a DT de seus efeitos).',
      },
      {
        name: 'Vítima',
        description:
          'Em algum momento de sua vida — infância, juventude ou início da vida adulta — você encontrou o Paranormal... E a experiência não foi nada boa. Você viu os espíritos dos mortos, foi atacado por uma entidade ou mesmo foi sequestrado para ser sacrificado em um ritual impedido no último momento. A experiência foi traumática, mas você não se abateu; em vez disso, decidiu lutar para impedir que outros inocentes passem pelo mesmo. E, já tendo sido vítima do Paranormal, se tornou habilidoso em evitar perigos.',
        trainedSkills: ['Reflexos', 'Vontade'],
        abilityName: 'Cicatrizes Psicológicas',
        abilityDescription: 'Você recebe +1 de Sanidade para cada 5% de NEX.',
      },
      {
        name: 'Amigo dos Animais',
        description:
          'Você desenvolveu uma conexão muito forte com outros seres: os animais. Seja por nunca ter se dado muito bem com humanos ou por preferir a companhia de um melhor amigo de quatro patas, você leva sua vida ao lado de um bichano e até mesmo aprende com a natureza perceptiva deles.',
        trainedSkills: ['Adestramento', 'Percepção'],
        abilityName: 'Companheiro Animal',
        abilityDescription:
          'Você consegue entender as intenções e sentimentos de animais, e pode usar Adestramento para mudar a atitude deles. Além disso, você possui um melhor amigo, um animal que cresceu com você e pelo qual tem profundo apego. Ele conta como um aliado que fornece +2 em uma perícia a sua escolha (aprovada pelo mestre). Quando você alcança NEX 35%, ele também passa a fornecer o bônus de um aliado de um tipo a sua escolha (aprovado pelo mestre). Por fim, quando você alcança NEX 70%, ele fornece a habilidade do tipo de aliado escolhido. Perder seu parceiro é muito doloroso. Se ele morrer, você perde 10 pontos de Sanidade permanentemente, além de ficar perturbado até o fim da cena.',
      },
      {
        name: 'Astronauta',
        description:
          'Outrora limitada a membros de algumas agências espaciais estatais, a profissão de explorador espacial se tornou mais acessível conforme mais países, e até mesmo empresas privadas, se envolveram com viagens na fronteira final. Como um astronauta, você se acostumou à pressão de ser responsável pela vida de seus colegas e por experimentos de milhões de reais. E foi na escuridão do espaço que você descobriu que não estamos sozinhos.',
        trainedSkills: ['Ciências', 'Fortitude'],
        abilityName: 'Acostumado ao Extremo',
        abilityDescription:
          'Quando sofre dano de fogo, de frio ou mental, você pode gastar 1 PE para reduzir esse dano em 5. A cada vez que usa esta habilidade novamente na mesma cena, seu custo aumenta em +1 PE.',
      },
      {
        name: 'Chef do Outro Lado',
        description:
          'Você nunca foi muito bom na culinária convencional. Depois de sobreviver ao paranormal, entretanto, descobriu um talento que é considerado um grande tabu até mesmo pelos ocultistas mais experientes: cozinhar e ingerir entidades do Outro Lado. Acreditando estar realizando algum tipo de arte gastronômica esotérica, ou simplesmente por se render a impulsos incontroláveis, você elabora pratos nunca vistos antes misturando ingredientes comuns da Realidade com aquilo que não deveria existir. Você é a prova viva do ditado popular: "tem gosto pra tudo".',
        trainedSkills: ['Ocultismo', 'Profissão'],
        abilityName: 'Fome do Outro Lado',
        abilityDescription:
          'Você pode usar partes de criaturas do Outro Lado como ingredientes culinários. No início de cada missão você pode solicitar essas partes como itens de Categoria I que ocupam 0,5 espaço, e pode obtê-las de criaturas derrotadas (cada criatura Pequena ou maior fornece 1 ingrediente paranormal). Você pode gastar uma ação de interlúdio e 1 ingrediente para preparar um prato especial; faça um teste de Profissão (cozinheiro) com DT 15 + 1d20 (o mestre oculta o resultado do teste até alguém comer o prato). Se você passar no teste, o prato fornece RD 10 contra o tipo de dano do elemento da criatura cujo ingrediente foi usado. Caso contrário, o prato causa vulnerabilidade a esse tipo de dano. Os efeitos duram até o fim da próxima cena. Independentemente do resultado, se alimentar do paranormal gera perda de 1 ponto permanente de Sanidade por refeição consumida. Se estiver usando a regra opcional Nível de Experiência e Nível de Exposição, o NEX do personagem aumenta em 2% para cada parte de criatura diferente que ingerir. A coragem para se beneficiar desses pratos é algo muito mais presente em grupos de cultistas e, por todas essas razões, não é uma ação apoiada pela Ordo Realitas.',
      },
      {
        name: 'Colegial',
        description:
          'Você era um aluno do colegial e tinha uma rotina baseada nos estudos, nas amizades e nos dramas típicos de alguém da sua idade, até que um encontro com o paranormal mudou sua vida. Tendo se unido à Ordem com uma mentalidade juvenil e pouca experiência de vida, você descobriu que sua verdadeira força está nos amigos que fizer pelo caminho.',
        trainedSkills: ['Atualidades', 'Tecnologia'],
        abilityName: 'Poder da Amizade',
        abilityDescription:
          'Escolha um personagem para ser seu melhor amigo. Se estiver em alcance médio dele e vocês puderem, pelo menos, trocar olhares, você recebe +2 em todos os testes de perícia. Entretanto, se ele morrer, seu total de PE é reduzido em –1 para cada 5% de NEX até o fim da missão.',
      },
      {
        name: 'Cosplayer',
        description:
          'Você é apaixonado pela arte do cosplay e dedicou sua vida a criar a melhor fantasia possível. Constantemente questionado por pessoas que confundem seus gostos e preferências artísticas com acusações ignorantes, você se acostumou a seguir em frente. Confrontado com o paranormal, você colocou sua arte, e sua resiliência, a serviço da Ordem.',
        trainedSkills: ['Artes', 'Vontade'],
        abilityName: 'Não é Fantasia, é Cosplay!',
        abilityDescription:
          'Você pode fazer testes de disfarce usando Artes em vez de Enganação. Além disso, ao fazer um teste de perícia, se estiver usando um cosplay que tem relação com ele, você recebe +2. Por exemplo, se estiver vestido de um personagem ágil, você recebe +2 em testes para ser furtivo e se equilibrar.',
      },
      {
        name: 'Diplomata',
        description:
          'Você atuava em uma área onde as habilidades sociais e políticas eram ferramentas indispensáveis. Talvez fosse representante comercial de uma empresa, membro de um partido político ou embaixador do governo. Em algum momento, entretanto, você teve uma experiência paranormal que revelou entidades com as quais não se é possível negociar. Agora, você usa os contatos que adquiriu para combater o Outro Lado.',
        trainedSkills: ['Atualidades', 'Diplomacia'],
        abilityName: 'Conexões',
        abilityDescription:
          'Você recebe +2 em Diplomacia. Além disso, se puder contatar um NPC capaz de lhe auxiliar, você pode gastar 10 minutos e 2 PE para substituir um teste de uma perícia relacionada ao conhecimento desse NPC, feito até o fim da cena, por um teste de Diplomacia.',
      },
      {
        name: 'Explorador',
        description:
          'Você é uma pessoa que se interessa muito por história ou geografia, frequentemente embarcando em trilhas e explorações para enriquecer seus estudos. Suas aventuras tornaram seu corpo mais resistente e capaz de se manter firme mesmo nas situações mais adversas. No entanto, um encontro trágico com o paranormal marcou sua jornada.',
        trainedSkills: ['Fortitude', 'Sobrevivência'],
        abilityName: 'Manual do Sobrevivente',
        abilityDescription:
          'Ao fazer um teste para resistir a armadilhas, clima, doenças, fome, sede, fumaça, sono, sufocamento ou veneno, você pode gastar 2 PE para receber +5 nesse teste. Além disso, em cenas de interlúdio, você considera condições de sono precárias como normais.',
      },
      {
        name: 'Experimento',
        description:
          'Você foi uma cobaia em um experimento físico. Pode ter sido um voluntário em um procedimento experimental legítimo, ou submetido a experimentos científicos ou paranormais contra sua vontade. Qualquer que seja a natureza desse evento, causou alterações permanentes em seu corpo, como um cheiro forte de químicos, cicatrizes ou manchas estranhas, ou outra metamorfose claramente antinatural. Elas concedem capacidades extraordinárias, mas trazem um estigma que provoca reações negativas em outras pessoas.',
        trainedSkills: ['Atletismo', 'Fortitude'],
        abilityName: 'Mutação',
        abilityDescription:
          'Você recebe resistência a dano 2 e +2 em uma perícia à sua escolha que seja originalmente baseada em Força, Agilidade ou Vigor. Entretanto, sofre -2 em Diplomacia.',
      },
      {
        name: 'Fanático por Criaturas',
        description:
          'Você sempre foi obcecado pelo sobrenatural. Desde que pode se lembrar, a ideia de encontrar uma criatura o fascina tanto quanto o assusta. Essa faísca fez você se tornar um "caçador de monstros", dedicando-se a localizar as feras citadas em documentários sensacionalistas. Para você, todo rumor e crendice pode esconder um fundo de verdade. Talvez uma de suas pesquisas o tenha levado diretamente a uma criatura paranormal, ou talvez elas tenham encontrado você primeiro.',
        trainedSkills: ['Investigação', 'Ocultismo'],
        abilityName: 'Conhecimento Oculto',
        abilityDescription:
          'Você pode fazer testes de Ocultismo para identificar criatura a partir de informações como uma imagem, rastros, indícios de sua presença ou outras pistas. Se passar, você descobre as características da criatura, mas não sua identidade ou tipo específico. Além disso, quando passa em um teste de Ocultismo para identificar criatura, você recebe também +2 em todos os testes contra a criatura até o fim da missão.',
      },
      {
        name: 'Fotógrafo',
        description:
          'Você é um artista visual que usa câmeras para capturar momentos e transmitir histórias através de imagens estáticas. Costumeiramente movido pela paixão de observar o mundo ao seu redor, buscando ângulos únicos e perspectivas singulares para documentar a vida e a sociedade, você não fazia ideia de que encontraria elementos paranormais através de sua lente.',
        trainedSkills: ['Artes', 'Percepção'],
        abilityName: 'Através da Lente',
        abilityDescription:
          'Quando faz um teste de Investigação ou de Percepção ou para adquirir pistas olhando através de uma câmera ou analisando fotos, você pode gastar 2 PE para receber +5 nesse teste (um personagem que se move olhando através de uma lente anda à metade de seu deslocamento).',
      },
      {
        name: 'Inventor Paranormal',
        description:
          'A curiosidade e a criatividade fizeram de você uma pessoa que busca constantemente desafiar limites e criar soluções inovadoras, sendo mais de uma vez intitulado como um "cientista louco". Você teve contato com o paranormal por meio de seus experimentos ou foi procurado pela Ordem porque suas pesquisas chamaram atenção demais. De qualquer forma, o Outro Lado inspira você a utilizar o desconhecido em suas invenções.',
        trainedSkills: ['Profissão', 'Tecnologia'],
        abilityName: 'Invenção Paranormal',
        abilityDescription:
          'Você possui um invento paranormal, um item de categoria 0 que ocupa 1 espaço e que permite que você execute o efeito de um ritual de 1º círculo de sua escolha. Para ativar o invento, você gasta uma ação padrão e faz um teste de Profissão (engenheiro) com DT 15 +5 para cada ativação na mesma missão. Se passar, o item faz o equivalente a conjurar o ritual sem pagar seu custo em PE. Se falhar, ele enguiça. Você pode gastar uma ação de interlúdio para fazer a manutenção do seu invento.',
      },
      {
        name: 'Jovem Místico',
        description:
          'Você possui uma profunda conexão com sua espiritualidade, suas crenças ou o próprio universo. Essa conexão faz com que você veja o mundo e viva sua vida de forma diferente e peculiar, características que o tornaram mais suscetível a um encontro com o paranormal.',
        trainedSkills: ['Ocultismo', 'Religião'],
        abilityName: 'A Culpa é das Estrelas',
        abilityDescription:
          'Escolha um número da sorte entre 1 e 6. No início de cada cena, você pode gastar 1 PE e rolar 1d6. Se o resultado for seu número da sorte, você recebe +2 em testes de perícia até o fim da cena. Caso contrário, na próxima vez que usar esta habilidade, escolha mais um número como número da sorte. Quando rolar um de seus números da sorte, a quantidade de números volta a 1.',
      },
      {
        name: 'Legista do Turno da Noite',
        description:
          'Em um trabalho como o seu, é de se esperar que você já tenha visto muita coisa. No entanto, quando o sol se põe, seus colegas vão embora e a luz artificial deixa cantos sombrios do necrotério, talvez você veja mais do que gostaria. Os sons que poderiam ter sido fruto de sua imaginação se revelaram mais do que um truque da sua própria mente, fazendo você descobrir que nem sempre a morte é o fim de tudo.',
        trainedSkills: ['Ciências', 'Medicina'],
        abilityName: 'Luto Habitual',
        abilityDescription:
          'Você sofre apenas a metade do dano mental por presenciar uma cena que esteja relacionada à rotina de um legista (como presenciar uma morte, ver um cadáver ou encontrar órgãos humanos). Além disso, quando faz um teste de Medicina para primeiros socorros ou necropsia, você pode gastar 2 PE para receber +5 nesse teste.',
      },
      {
        name: 'Mateiro',
        description:
          'Você conhece áreas rurais e selvagens. Você pode ser um guia florestal, um biólogo de campo ou simplesmente um entusiasta da vida selvagem. Qualquer que seja sua relação com a natureza, ela foi sua porta para o contato com o Outro Lado.',
        trainedSkills: ['Percepção', 'Sobrevivência'],
        abilityName: 'Mapa Celeste',
        abilityDescription:
          'Desde que possa ver o céu, você sempre sabe as direções dos pontos cardeais e consegue chegar sem se perder em qualquer lugar que já tenha visitado ao menos uma vez. Quando faz um teste de Sobrevivência, você pode gastar 2 PE para rolar o teste novamente e escolher o melhor entre os dois resultados. Além disso, em cenas de interlúdio, você considera condições de sono precárias como normais.',
      },
      {
        name: 'Mergulhador',
        description:
          'Seja por profissão ou por hobby, você é um aventureiro subaquático que explora os mistérios e maravilhas do mundo submerso. Trajando seu equipamento de mergulho, você consegue se aventurar a grandes profundidades para descobrir um mundo totalmente diferente daquele que conhecemos na superfície. Infelizmente, no dia em que você olhou para o abismo, ele encarou você de volta.',
        trainedSkills: ['Atletismo', 'Fortitude'],
        abilityName: 'Fôlego de Nadador',
        abilityDescription:
          'Você recebe +5 PV e pode prender a respiração por um número de rodadas igual ao dobro do seu Vigor. Além disso, quando passa em um teste de Atletismo para natação, você avança seu deslocamento normal (em vez da metade).',
      },
      {
        name: 'Motorista',
        description:
          'Você é um caminhoneiro, motorista de aplicativo, motoboy, piloto de corrida, motorista de ambulância ou qualquer outro tipo de condutor profissional. Você levava a vida transportando cargas ou passageiros, até o dia em que suas viagens cruzaram o caminho do Outro Lado.',
        trainedSkills: ['Pilotagem', 'Reflexos'],
        abilityName: 'Mãos no Volante',
        abilityDescription:
          'Você não sofre penalidades em testes de ataque por estar em um veículo em movimento e, sempre que estiver pilotando e tiver que fazer um teste de Pilotagem ou resistência, pode gastar 2 PE para receber +5 nesse teste.',
      },
      {
        name: 'Nerd Entusiasta',
        description:
          'Você dedicou muito do seu tempo aprendendo sobre videogames, RPGs de mesa, ficção científica ou qualquer outro assunto considerado "nerd". Sua obsessão em pesquisar fundo seus assuntos de interesse e sua capacidade em lidar com os mais variados temas chamou a atenção de organizações paranormais.',
        trainedSkills: ['Ciências', 'Tecnologia'],
        abilityName: 'O Inteligentão',
        abilityDescription:
          'O bônus que você recebe ao utilizar a ação de interlúdio ler aumenta em +1 dado (de +1d6 para +2d6).',
      },
      {
        name: 'Psicólogo',
        description:
          'Lidar com o paranormal é extremamente desgastante e danoso para a mente, compreender os horrores do Outro Lado pode facilmente fazer um ser humano normal perder a cabeça. É por isso que, no limite do possível, você tenta ajudar seus aliados a lidar com as situações bizarras do dia-a-dia ao mesmo tempo que mantém sua sanidade no lugar.',
        trainedSkills: ['Diplomacia', 'Intuição'],
        abilityName: 'Sessão de terapia',
        abilityDescription:
          'Durante uma cena de interlúdio, você pode gastar uma de suas ações para ter uma sessão de terapia com até uma pessoa por ponto de Intelecto, fazendo elas recuperam o dobro de sanidade pela ação relaxar neste interlúdio.',
      },
      {
        name: 'Profetizado',
        description:
          'Como qualquer pessoa, você vai morrer. Entretanto, diferente delas, você sabe como isso vai acontecer. De algum jeito, seja por pesadelos, pensamentos intrusivos ou até visões inesperadas, você tem uma premonição clara — ou misteriosa e enigmática — de como serão seus últimos momentos de vida. Será que você é capaz de mudar seu próprio destino?',
        trainedSkills: ['Vontade', 'Investigação'],
        abilityName: 'Luta ou Fuga',
        abilityDescription:
          'Conhecer os sinais de sua morte o deixa mais confiante, principalmente quando eles não estão presentes. Você recebe +2 em Vontade. Quando surge uma referência a sua premonição, uma onda de adrenalina toma seu corpo e seus instintos de luta ou fuga se intensificam. Além do bônus em Vontade, você recebe +2 PE temporários que duram até o fim da cena.',
      },
      {
        name: 'Repórter Investigativo',
        description:
          'Você está sempre em busca de histórias significativas, investigando eventos, entrevistando fontes e analisando dados para descobrir a verdade por trás dos acontecimentos. Profissionais do seu ramo costumam ser curiosos, persistentes e, em muitos casos, éticos em sua busca pela verdade. Por outro lado, essa profissão leva pessoas ao encontro do indescritível, e com você não foi diferente.',
        trainedSkills: ['Atualidades', 'Investigação'],
        abilityName: 'Encontrar a Verdade',
        abilityDescription:
          'Você pode usar Investigação no lugar de Diplomacia ao fazer testes para persuadir e mudar atitude e, quando faz um teste de Investigação, pode gastar 2 PE para receber +5 nesse teste.',
      },
      {
        name: 'Adepto ao Paranormal',
        description:
          'O Outro Lado constantemente te chama, te seduz, te oferece o acesso a insanidade do paranormal em troca de poderes inigualáveis e você sem pensar duas vezes aceita. E se for para entrar nisso, você vai entrar de cabeça. De alguma forma você criou uma facilidade para acessar o Outro Lado sem que ele te consuma de volta tão facilmente, talvez isso venha dos seus anos de estudo ou até alguma predisposição esquisita, mas aconteceu.',
        trainedSkills: ['Ocultismo', 'Vontade'],
        abilityName: 'Mente preparada',
        abilityDescription:
          'Você recebe +5 no teste de Ocultismo para o “Custo do Paranormal”.',
      },
      {
        name: 'Adestrador',
        description:
          'Às vezes animais são melhores que pessoas, talvez por isso que você tenha dedicado sua vida a eles. A certeza é que você sabe como essas criaturas pensam e agem, e com elas, você se fortalece e têm aliados formidáveis, agindo e protegendo por instinto. Desde um adestrador de cachorros até alguém com um amigo inusitado. O seu caminho em algum momento cruzou com feras totalmente diferentes de tudo o que você já viu naz vida.',
        trainedSkills: ['Adestramento', 'Diplomacia'],
        abilityName: 'Um amigo',
        abilityDescription:
          'Você tem um animal que é considerado um aliado de um tipo a sua escolha.',
      },
      {
        name: 'Apostador',
        description:
          'Às cartas estão na mesa, afinal isso tudo sempre foi um grande jogo pra você. Talvez essa adrenalina, incerteza ou até a emoção dos resultados à medida que as cartas são viradas te faça o que tu é nos dias de hoje. As inúmeras mesas de cassinos clandestinos ou bares te fizeram aprender uma coisa, enganar ou ser enganado. As pessoas são bem previsíveis se você souber ler elas. Mas talvez a sua maior aposta tenha sido entrar no mundo do paranormal, será que essa foi a melhor decisão, será que a sorte vai estar ao seu favor?',
        trainedSkills: ['Intuição', 'Enganação'],
        abilityName: 'Tiro de sorte',
        abilityDescription:
          'Com o gasto de 2 PE você pode obter +5 em uma rolagem a sua escolha, exceto rolagens com base de Presença e Intelecto, porém, essa rolagem tem 50% de chance de falhar (Role 1d20, se tirar 10 para baixo é uma falha automática).',
      },
      {
        name: 'Escritor Paranormal',
        description:
          'Histórias devem ser contadas. Você sempre contou elas, afinal são só histórias. Mas e quando elas podem voltar contra você? Se as histórias escritas por você se tornam realidade e começam a trazer mortes, sofrimento e medo nas pessoas. O que fazer? Acabar com a história. Mas resta ao autor finalizar esse livro com um fim trágico ou não',
        trainedSkills: ['Atualidades', 'Ocultismo'],
        abilityName: 'Nas entrelinhas',
        abilityDescription:
          'Ao ser bem-sucedido ao realizar um teste de “Identificar Criatura”, você pode gastar 2 PE para fazer uma anotação sobre ela, para cada anotação, você pode escolher um número de alvos que possam te ouvir (incluindo você) igual seu valor de Intelecto para ganhar um bônus de +2 em testes de resistência contra essa criatura, esse valor é acumulável e permanente.',
      },
      {
        name: 'Faz-tudo',
        description:
          'É tudo você nesse mundo, as tarefas difíceis sempre acabam caindo sob você, mas fazer o que, você sempre está ali para ajudar. Seja gerenciando um estoque da sua loja ou o armamento de uma organização, é com seu esforço que o seu local de trabalho continua em pé, seja onde for.',
        trainedSkills: ['Profissão', 'Tecnologia'],
        abilityName: 'Pau pra toda obra',
        abilityDescription:
          'Você tem +5 espaços de inventário.',
      },
      {
        name: 'Influenciador',
        description:
          'Ser influenciador não é fácil, você tem que manter seu público engajado para que alguma plataforma virtual não te jogue em um limbo muito pior que o Outro Lado. Você dificilmente vai conseguir usar suas habilidades profissionais contra os terrores do paranormal, mas talvez consiga uma satisfação de ver que seu trabalho está andando ainda.',
        trainedSkills: ['Atualidades', 'Diplomacia'],
        abilityName: 'Algoritmo',
        abilityDescription:
          'Você agora tem a ação “Criar Conteúdo” em um interlúdio quando tiver acesso a internet, você deve rolar d20, se você tirar de 1 a 5, você não recupera sanidade, de 6 a 10 você recupera seu Limite de PE em sanidade, de 11 a 15 você recupera seu Limite de PE + 5 em sanidade e de 16 a 20 você recupera seu Limite de PE + 10 em sanidade. Ao atingir o NEX de 30%, você ganha +5 no teste desta ação.',
      },
      {
        name: 'Médico 24 horas',
        description:
          'O que é uma hora de sono a menos e uma a mais no trabalho? Enfim, você está salvando vidas. Após o seu contato com o paranormal, você não deixou de perder seu descanso para auxiliar seus aliados a se recuperarem de seus danos de batalha. Quase nada mudou, você ainda está salvando vidas.',
        trainedSkills: ['Medicina', 'Percepção'],
        abilityName: 'Plantão',
        abilityDescription:
          'Você pode realizar “Cuidados Prolongados” da perícia Medicina, a partir do Grau de Treinamento Treinado, além disso, “Cuidados Prolongados” agora também dobram a recuperação de PE pela ação de dormir de aliados afetados. Adicionalmente, ao chegar a NEX 35%, aliados afetados por “Cuidados Prolongados” recuperam uma quantidade de Sanidade igual o seu Intelecto ao usarem a ação dormir.',
      },
      {
        name: 'Palestrinha',
        description:
          'O paranormal não existe, quer dizer, ele existe, mas isso não tem que afetar sua cabeça, você só precisa preparar sua mente, de alguma forma, para que ele se torne algo secundário comparado aos objetivos da sua vida, que possivelmente é se manter vivo no seu estado atual. Você pode não ter a mente mais estável e muito menos pautar suas falas em fontes confiáveis mas ao menos você vai tentar manter o ânimo e foco de seus colegas como sempre fez, só que dessa vez não vai ganhar tanto dinheiro com isso.',
        trainedSkills: ['Diplomacia', 'Enganação'],
        abilityName: 'Mudança de mindset',
        abilityDescription:
          'Todos os aliados que em uma cena de interlúdio gastarem uma ação para “Ler” junto a você, recebem 2d6 ao invés de 1d6 em uma rolagem de Intelecto ou Presença.',
      },
      {
        name: 'Pesquisador Paranormal',
        description:
          'O mundo e seus aspectos às vezes parecem se tornar entediantes comparados ao inexplicável e o assombrado, entender o incompreensível se tornou uma atividade muito interessante para você. No final do dia, ver uma criatura não será um motivo de pavor, mas sim de curiosidade e entusiasmo, ou não.',
        trainedSkills: ['Ocultismo', 'Ciências'],
        abilityName: 'Já vi pior',
        abilityDescription:
          'Você recebe +5 em testes de Presença Perturbadora, caso posteriormente você consiga afinidade com um elemento, esse bônus aumenta para +10 com criaturas desse elemento.',
      },
      {
        name: 'Piloto',
        description:
          'Você é a velocidade. A prática o levou a perfeição quando o assunto é domar o volante. A adrenalina das manobras e a satisfação ao ver o medidor de velocidade subindo é o que move você para frente, um motor imparável. Agora você utiliza das suas habilidades para o benefícios das organizações que sempre vão precisar de um bom piloto, tanto para uma viagem longa ou uma fuga desesperada',
        trainedSkills: ['Pilotagem', 'Iniciativa'],
        abilityName: 'Rápido e furioso',
        abilityDescription:
          'Escolha uma opção entre veículos de grande porte (como caminhões e vans), veículos de médio porte (como carros e motos) e veículos de pequeno porte (como skates, patins, patinetes, etc.), você tem +5 em testes de pilotagem com esses veículos.',
      },
      {
        name: 'Químico',
        description:
          'Saber muito é poder fazer um monte de coisa, perigosa ou não. Seus estudos agora te dão possibilidade de fazer muitos experimentos que você foi ensinado a fazer mas não recomendado, até porque não é legal.',
        trainedSkills: ['Ciências', 'Tecnologia'],
        abilityName: 'Você sabe demais',
        abilityDescription:
          'Você pode gastar uma ação em um Interlúdio para fazer um veneno que tenha sua DT de resistência de até 15. em 30% você pode fazer até dois venenos que tenham sua DT de resistência até 20 e em 50% você pode fazer até três venenos que tenham sua DT de resistência até 25.',
      },
      {
        name: 'Treinador',
        description:
          'Segunda-feira: Treino. Terça-feira: Treino. Quarta-feira: Treino. Quinta-feira: Treino. Sexta-feira… Treino. Você achou mesmo que o paranormal ia te parar? Ia acabar com seu estilo de vida? Não, muito pelo contrário, ele só o fez... treinar mais forte? O que importa é que seu físico não vai ficar para trás, e você vai fazer seu esforço para colocar todos os seus aliados no mesmo ritmo.',
        trainedSkills: ['Atletismo', 'Luta'],
        abilityName: 'Malhe enquanto eles dormem',
        abilityDescription:
          'Todos os aliados que em uma cena de interlúdio gastarem uma ação para “Exercitar” junto a você, recebem 2d6 ao invés de 1d6 em uma rolagem de Agilidade, Força ou Vigor.',
      },
      {
        name: 'Zelador',
        description:
          'Ser um zelador não é fácil, você possivelmente já presenciou todos os terrores da nossa realidade, mas mesmo assim não larga o posto, sempre fazendo seu trabalho com perfeição. Seu olhar atento e perfeccionismo te perseguem e incrivelmente podem ser úteis para investigar as mais sinistras bagunças que possa imaginar. É fato: Toda organização ou culto precisa de um zelador',
        trainedSkills: ['Atletismo', 'Percepção'],
        abilityName: 'Casa suja chão sujo..',
        abilityDescription:
          'Você pode gastar 1 PE para ter +5 em investigação para achar resíduos em cenas de investigação. Além disso, caso limpe uma cena de investigação, a critério do mestre, você recebe 3 de PE temporários até o seu próximo descanso.',
      },
    ])
  }
}
