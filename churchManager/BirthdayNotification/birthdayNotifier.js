import members from "./members.js";

const getBirthdayPeople = (members) => {
  const today = {
    day: new Date().getDate(),
    month: new Date().getMonth(),
  };

  const birthdayPeople = members.filter((member) => {
    const birthdayDate = new Date(member.birthdayDate);
    const birthday = {
      day: birthdayDate.getDate(),
      month: birthdayDate.getMonth(),
    };

    const isToday =
      today.day === birthday.day && today.month === birthday.month;
    return isToday;
  });

  return birthdayPeople;
};

const getMessage = (people) => {
  const birthdayPeople = people.reduce(
    (prev, current) => prev + `\n🎂 *${current.fullName.trim()}*`,
    ""
  );

  const isEvenDay =
    new Date(birthdayPeople[0].birthdayDate).getDate() % 2 === 0;

  const wishes = [
    "Que la gracia y amor del señor les acompañe siempre, acercandose más cada año a sus promesas",
    "Que el Señor les colme de bendiciones infinitas, alegría y paz en este día especial",
  ];

  return `🌟 *¡Feliz Cumpleaños a nuestros amados hermanos y hermanas!* 🎉

  Hoy celebramos el don de la vida de:
  ${birthdayPeople}

  ${wishes[isEvenDay ? 0 : 1]}.🎁🙏 

  Con amor y oración,
  *Comité de Trabajo Social*
  
  ⚠️ ⚠️ ⚠️
  _Si usted está cumpliendo años hoy, y no lo felicitamos le pedimos nos perdone. Muy seguramente no tenemos sus datos de membresía actualizados_ *Por favor acercarse al comité de Trabajo Social*
  `;
};

const birthdayNotifier = async (WpClient) => {
  const birthdayPeople = getBirthdayPeople(members);
  if (birthdayPeople.length <= 0) {
    console.info("Not birthday people today")
    return;
  }

  const message = getMessage(birthdayPeople);
  console.info("sending message")
  const response = await WpClient.sendMessage(`120363311402211353@g.us`, message);
  console.info(response);

};

export default birthdayNotifier;
