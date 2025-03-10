import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedQuestions() {
  const questionsCount = await prisma.question.count();
  
  if (questionsCount > 0) {
    console.log('ℹ️ Perguntas já existem no banco, pulando seed');
    return;
  }

  console.log('🔄 Inserindo perguntas...');
  
  const questions = [
    { id: 1, text: "Os líderes frequentemente avaliam e corrigem rapidamente o trabalho realizado." },
    { id: 2, text: "As pessoas são engajadas principalmente pela contribuição que proporcionam, acima de outros motivos." },
    { id: 3, text: "Diante um cotidiano agitado, por vezes os valores estabelecidos ficam em segundo plano." },
    { id: 4, text: "Os líderes equilibram a preocupação com o desenvolvimento da equipe e a obtenção de resultados." },
    { id: 5, text: "Os valores guiam todas as decisões tomadas." },
    { id: 6, text: "Os colaboradores são motivados principalmente por recompensas desafiadoras." },
    { id: 7, text: "As opiniões dos colaboradores nem sempre são consideradas nas decisões que os afetam." },
    { id: 8, text: "Os valores organizacionais estão incorporados nas decisões tomadas diariamente." },
    { id: 9, text: "Manter a produtividade e alcançar os objetivos de desempenho estabelecidos estão acima de tudo." },
    { id: 10, text: "As ações diárias dos líderes estão alinhadas com o discurso que eles promovem." },
    { id: 11, text: "Todas as pessoas entendem claramente o propósito e como seu trabalho contribui para alcançá-lo." },
    { id: 12, text: "Existe desconexão entre os valores da organização e as ações observadas no trabalho." },
    { id: 13, text: "Os líderes inspiram pessoas a atingirem alto potencial e alcançarem resultados excepcionais." },
    { id: 14, text: "Há certa desconexão entre o propósito e as ações diárias" },
    { id: 15, text: "Valores pessoais dos colaboradores estão alinhados com valores organizacionais." },
    { id: 16, text: "Os líderes têm um conhecimento parcial das pessoas que aqui trabalham." },
    { id: 17, text: "O propósito é incorporado diariamente por todos os colaboradores, sem exceção." },
    { id: 18, text: "É preciso monitorar comportamentos dos colaboradores para não correr risco de situações indesejadas." },
    { id: 19, text: "O organograma delimita os papéis e responsabilidades." },
    { id: 20, text: "Nossas intenções direcionam nossas ações para oferecer o melhor no mercado." },
    { id: 21, text: "Lutamos diariamente para cumprir o que foi combinado, mas nem sempre atingimos o esperado." },
    { id: 22, text: "Abrimos mão de resultados imediatos quando entendemos que não somos capazes de atender certas demandas." },
    { id: 23, text: "Nossa organização se diferencia de forma única, tornando-nos menos afetados pela concorrência." },
    { id: 24, text: "Nosso maior desafio, acima de tudo, é se destacar da concorrência." },
    { id: 25, text: "No mercado, enfrentamos uma grande quantidade de concorrentes, em um ambiente muitas vezes desleal." },
    { id: 26, text: "Para nós, todos são potenciais compradores de nossos produtos/serviços, independente da nossa capacidade de atendimento." },
    { id: 27, text: "O crescimento é nossa prioridade, mesmo que isso signifique sacrificar outros aspectos." },
    { id: 28, text: "As áreas são ajustadas regularmente para se alinhar à evolução das estratégias de negócio." },
    { id: 29, text: "Na organização, cumprir nossas promessas é mais importante do que gerar resultados econômicos." },
    { id: 30, text: "Nem todos conhecem as competências essenciais que diferenciam nosso negócio." },
    { id: 31, text: "Todos colaboradores, independentemente da função, compreendem claramente a contribuição do seu trabalho." },
    { id: 32, text: "A organização nos desafia continuamente a desenvolver competências que assegurem os diferenciais competitivos do negócio." },
    { id: 33, text: "Renovamos periodicamente nossos diferenciais para alinhar com as necessidades do mercado." },
    { id: 34, text: "Nossa hierarquia é bem definida com ênfase na descrição dos cargos e funções." },
    { id: 35, text: "Priorizamos negócios que geram maior receita, mesmo que não sejam nosso foco principal." },
    { id: 36, text: "Somos incomparáveis no mercado devido às competências que possuímos." },
    { id: 37, text: "O que oferecemos se assemelha às outras ofertas existentes no mercado competitivo." },
    { id: 38, text: "Atuamos no mercado identificando aqueles que mais se beneficiarão do que oferecemos." },
    { id: 39, text: "Valorizamos resolver problemas rapidamente e por vezes, ignoramos oportunidades de aprendizado." },
    { id: 40, text: "Problemas de relacionamento são prontamente conversados e resolvidos pelas pessoas." },
    { id: 41, text: "Frequentemente há a sensação de que o tempo nunca é suficiente, e algumas pessoas não têm clareza sobre suas prioridades." },
    { id: 42, text: "No dia a dia, todos estão dedicados a criar experiências únicas com seu trabalho." },
    { id: 43, text: "São realizados esforços consistentes para descobrir, valorizar e desenvolver as competências e talentos dos colaboradores." },
    { id: 44, text: "Ainda falta incentivo para que a curiosidade se transforme em ideias empreendedoras e estas em projetos concretos." },
    { id: 45, text: "Com o objetivo de evitar riscos e surpresas desagradáveis, é comum replicar o que deu certo no passado." },
    { id: 46, text: "É comum que as pessoas realizem tarefas sem entender claramente a sua finalidade." },
    { id: 47, text: "Os colaboradores são incentivados a usar sua intuição, assumir riscos e propor novas soluções." },
    { id: 48, text: "As avaliações de resultados são momentos de aprendizagem em que os indicadores de fidelização e engajamento têm a mesma importância que os financeiros." },
    { id: 49, text: "A baixa conexão e alinhamento entre equipes dificultam a entrega com excelência, sendo que a maior preocupação está centrada na conclusão das tarefas." },
    { id: 50, text: "Valorizamos a aprendizagem contínua e a incorporação de novas práticas como parte essencial do trabalho." },
    { id: 51, text: "Expressões como 'ninguém' e 'todo mundo' são usadas para descrever comportamentos das pessoas." },
    { id: 52, text: "As pessoas têm autonomia para tomar decisões sobre seu trabalho, pois os líderes reservam tempo regularmente para alinhar expectativas." },
    { id: 53, text: "Ainda há falta de cuidado nas relações que afetam a fidelização e o engajamento das pessoas." },
    { id: 54, text: "As tarefas são distribuídas com base nos cargos e não é claro o conjunto de competências individuais." },
    { id: 55, text: "Existe um ambiente em que as pessoas são encorajadas a descobrir coisas novas a cada dia." },
    { id: 56, text: "As pessoas frequentemente se arriscam em novos desafios, promovendo a superação e o crescimento." },
    { id: 57, text: "Os processos são flexíveis e não burocráticos, facilitando a eficiência e minimizando o retrabalho." },
    { id: 58, text: "Os procedimentos atuais reforçam a resistência a mudanças, dificultando a aceitação de inovações criativas." },
    { id: 59, text: "Os indicadores de desempenho atuais reforçam a ênfase na cobrança de resultados econômicos." },
    { id: 60, text: "Reconhecemos e aproveitamos todas as oportunidades para transformar o trivial em excepcional." }
  ];

  await prisma.question.createMany({
    data: questions,
    skipDuplicates: true,
  });

  console.log(`✅ ${questions.length} perguntas inseridas com sucesso`);
}

export default seedQuestions;