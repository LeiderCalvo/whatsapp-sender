import backupMembersList from "./members.js";

const URL = "https://ctmkrhcfysnaufjwxriu.supabase.co"
const API = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bWtyaGNmeXNuYXVmand4cml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MjE2MDksImV4cCI6MjA1MjA5NzYwOX0.FSSso84OKz1V-6zD7fs8SfwMeErSMJSAPZDs3ISl7X4"

const getMembers = async () => {
  try {
    const response = await fetch(URL + '/rest/v1/profiles', {
      method: "GET",
      headers: {
        'apikey': API,
        'Authorization': 'Bearer ' + API,
        "Content-Type": "application/json"
      }
    });
    const profiles = await response.json();
    return profiles
  } catch (error) {
    console.info("using backup", error)
    return backupMembersList
  }
};

const memberToBirthdayData = (members) => {
  const birthdays = members.map((x) => ({
    fullName: `${x.first_name} ${x.second_name ? x.second_name + ' ' : ''}${x.first_surname
      } ${x.second_surname || ''}`,
    birthdayDate: x.birthday_date
  }))
  return birthdays
}

const getBirthdayPeople = (members) => {
  const today = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
  };

  const birthdayPeople = members.filter((member) => {
    const [_, month, day] = member.birthdayDate.split("-")
    const isToday = today.day === Number(day) && today.month === Number(month);
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
  const members = await getMembers()
  const data = memberToBirthdayData(members);

  const birthdayPeople = getBirthdayPeople(data);
  if (birthdayPeople.length <= 0) {
    console.info("Not birthday people today")
    return;
  }

  const message = getMessage(birthdayPeople);
  console.info("sending message", message)
  const response = await WpClient.sendMessage(`120363311402211353@g.us`, message);
  console.info(response);

};

export default birthdayNotifier;
