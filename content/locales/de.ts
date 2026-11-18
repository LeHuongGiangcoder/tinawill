import type { Translation } from "@/lib/content";

/**
 * DEUTSCHE FASSUNG — chỉ khai chữ khác bản gốc tiếng Anh (content/client.ts).
 * Mảng phải giữ đúng thứ tự và số phần tử của bản gốc: trộn theo vị trí.
 *
 * Xưng "ihr/euch" như thiệp cưới gửi bạn bè, không dùng "Sie" trang trọng.
 */
export const de: Translation = {
  ceremony: {
    weekday: "Samstag",
    dateShort: "27. März 2027",
  },
  venue: {
    mapLabel: "Auf der Karte ansehen",
    note: "Ein Ort, dessen Name „Zuhause“ und „Frieden“ bedeutet.",
  },
  calendar: {
    title: "Hochzeit von Will & Tina",
  },

  intro: {
    label: "Hochzeitseinladung von Tina und Will",
    title: "Hallo :)",
    note: "Wir haben ganz besondere Neuigkeiten für euch.",
    cta: "Erzählt schon!",
  },

  cover: {
    invitation: "Wir laden euch herzlich\nzu unserer Hochzeit ein!!!",
    logoLabel: "Monogramm von Will und Tina",
    yes: "sie hat „JA“ gesagt",
  },

  hero: {
    lead: "Feiert mit uns ein Wochenende voller Liebe, gutem Essen und Freude am Fluss in Hoi An — an einem Ort, dessen Name „Zuhause“ und „Frieden“ bedeutet.",
    closing:
      "Wir können uns keinen schöneren Anfang für unser gemeinsames Leben vorstellen, als umgeben von den Menschen, die wir am meisten lieben, an diesem magischen Ort.",
    scrollHint: "Scrollen",
  },

  loveStory: {
    eyebrow: "Wie alles begann",
    title: "Unsere Geschichte",
    paragraphs: [
      "Das erste Mal haben wir uns auf einer Veranstaltung unterhalten. Die Veranstaltung war vorbei, alle gingen nach Hause — und wir waren mit unserem Gespräch noch lange nicht fertig. Also sind wir in ein kleines chinesisches Restaurant um die Ecke weitergezogen und haben bis 3 Uhr morgens geredet. Als es Zeit war heimzugehen, fragte Tina Will, wo er wohnt. Da stellten wir fest, dass wir im selben Gebäude wohnten. In dieser Nacht teilten wir uns ein Grab nach Hause.",
      "Dann hat das Universum mitgemischt. Die ganze folgende Woche liefen wir uns jeden einzelnen Tag über den Weg — im Fitnessstudio, im Café, jeden Tag zu einer anderen Uhrzeit, ohne es je zu planen. Am siebten Tag konnte man das kaum noch Zufall nennen.",
      "Und der Rest ist, wie man so schön sagt, Geschichte.",
      "Es war nicht immer leicht. Wills Blick auf die Welt ist von der deutschen Kultur geprägt — direkt, strukturiert, ein bisschen trocken, sagt man. Tinas von der amerikanischen — offen, spontan, immer bereit für noch mehr. Wir hatten unseren Anteil an Kulturclashs (und ein paar sehr lange Gespräche darüber). Aber jeder Unterschied, den wir gemeinsam überwunden haben, hat uns etwas Neues übereinander gelehrt und uns näher zusammengebracht.",
    ],
    closing:
      "Zwei Menschen, zwei Kulturen, zwei Arten, die Welt zu sehen — und jetzt ein gemeinsames Leben.",
  },

  timeScene: {
    intro:
      "Feiert mit uns ein Wochenende voller Liebe, gutem Essen und Freude am Fluss in Hoi An — an einem Ort, dessen Name „Zuhause“ und „Frieden“ bedeutet. Wir können uns keinen schöneren Anfang für unser gemeinsames Leben vorstellen, als umgeben von den Menschen, die wir am meisten lieben.",
    calendarLabel: "Zum Kalender",
    sceneLabel: "Zwei Katzen dösen auf Sonnenliegen in einem tropischen Garten",
  },

  venueScene: {
    title: "Unser\nHochzeitsort",
    cityLine: "Da Nang, Vietnam",
    mapLabel: "Karte öffnen",
    sceneLabel: "Zwei erhobene Gläser über einer gedeckten Hochzeitstafel",
  },

  visa: {
    eyebrow: "Vor dem Abflug",
    title: "Visum",
    subtitle: "Egal welchen Reisepass ihr habt: Er muss ab der Einreise noch mindestens 6 Monate gültig sein.",
    pickPrompt: "Wählt euren Reisepass",
    pickNote: "Wir zeigen euch nur den Teil, der für euch gilt.",
    regionsLabel: "Reisepass wählen",
    visaHeading: "Euer Visum",
    flightHeading: "Anreise per Flug",
    flightNote:
      "Da es eine internationale Reise ist, empfehlen wir euch, eine größere Reise drumherum zu planen und mehr von Vietnam zu sehen. In dem Fall könnt ihr nach Ho-Chi-Minh-Stadt oder Hanoi fliegen und von dort aus nach Hoi An (Da Nang) weiterreisen.",
    routes: {
      direct: {
        lead: "Direkt nach Da Nang (DAD) — etwa 2–3 Stunden.",
        items: [
          "Direktflüge von den meisten großen Drehkreuzen: Singapur, Bangkok, Kuala Lumpur und Hongkong.",
        ],
      },
      asiaHub: {
        lead: "Ein Zwischenstopp, dann direkt weiter nach Da Nang (DAD).",
        items: ["Umsteigen in Ho-Chi-Minh-Stadt, Hanoi, Singapur, Kuala Lumpur oder Bangkok."],
      },
      europe: {
        lead: "Ein Zwischenstopp, dann direkt weiter nach Da Nang (DAD).",
        items: [
          "Umsteigen in Singapur, Bangkok, Doha, Dubai oder Istanbul.",
          "Oder nach Ho-Chi-Minh-Stadt / Hanoi fliegen und mit einem kurzen Inlandsflug — etwa 1 Std. 20 Min. — weiter nach Da Nang.",
        ],
      },
      pacific: {
        lead: "Ein Zwischenstopp, dann direkt weiter nach Da Nang (DAD).",
        items: ["Umsteigen in Seoul, Tokio, Taipeh, Hongkong oder Singapur."],
      },
    },
    evisa: {
      title: "So bekommt ihr euer E-Visum",
      items: [
        "Beantragt es nur auf der offiziellen Seite: evisa.gov.vn — Nachahmerseiten verlangen Zusatzgebühren.",
        "Die Gebühr beträgt 25 USD für die einmalige Einreise, zahlbar per Karte.",
        "Stellt den Antrag mindestens 3–4 Wochen vor eurem Flug.",
        "Prüft alle Angaben sorgfältig — bei Fehlern wird die Gebühr nicht erstattet.",
        "Wählt den Internationalen Flughafen Da Nang als Einreiseort.",
        "Druckt euer genehmigtes E-Visum aus und nehmt es mit.",
      ],
      action: { label: "evisa.gov.vn öffnen" },
    },
    airport: {
      title: "Vom Flughafen",
      lead: "Das Resort ist etwa 40–45 Minuten mit dem Auto entfernt.",
      body: "Grab ist einfach und günstig — gebt beim Buchen einfach den Namen des Resorts ein, dann erscheint es sofort.",
    },
    regions: [
      { label: "Europa", verdict: "Visumfrei, bis zu 45 Tage." },
      { label: "Südostasien", verdict: "Visumfrei, bis zu 30 Tage." },
      {
        label: "Hongkong",
        verdict: "E-Visum erforderlich.",
        note: "Wenn ihr sowohl einen HKSAR- als auch einen BN(O)-Pass habt, beantragt das Visum und reist mit eurem HKSAR-Pass.",
      },
      { label: "Indien", verdict: "E-Visum erforderlich." },
      { label: "Malediven", verdict: "E-Visum erforderlich." },
      { label: "USA", verdict: "E-Visum erforderlich." },
    ],
  },

  travel: {
    eyebrow: "Wenn ihr hier seid",
    title: "Reiseinfos",
    intro: "Wichtige Infos für eure Ankunft!!!",
    highlight: ["Wichtige Infos"],
    introAction: "Klickt auf die Tür, um sie zu öffnen",
    tabsLabel: "Thema wählen",
    gateLabel: "Öffnen",
    tabs: [
      {
        label: "Unterkunft & Kontakt",
        groups: [
          {
            topics: [
              {
                label: "Hochzeitsnacht",
                body: "Die Hochzeitsnacht geht auf uns. 💛\nWir übernehmen für alle Gäste eine Nacht im NHAAN Resort & Spa Hoi An am Samstag, 27. März 2027 — so könnt ihr bis spät feiern und einfach zu eurem Zimmer zurückspazieren.",
              },
              {
                label: "Länger bleiben?",
                body: "Wir würden uns freuen, wenn ihr am Sonntag beim Farewell Brunch dabei seid — und Hoi An ist ein paar zusätzliche Tage absolut wert. Um weitere Nächte im Resort zu buchen, kontaktiert bitte unsere Hochzeitsplanerin per WhatsApp: +84 363 059 436 oder per E-Mail: teamhandsheart.planner@gmail.com — das Team kümmert sich um alles.",
                actions: [{ label: "WhatsApp" }, { label: "E-Mail" }],
              },
            ],
          },
        ],
      },
      {
        label: "Wetter & Tipps",
        groups: [
          {
            topics: [
              {
                label: "Wetter",
                body: "Ende März ist es warm und meist trocken, etwa 24–29 °C. Packt Sonnencreme, Sonnenbrille und etwas Leichtes für den Abend ein.",
              },
              {
                label: "Währung & Bezahlen",
                body: "Vietnamesischer Dong (VND). Im Resort könnt ihr mit Karte zahlen; für Märkte und Cafés etwas Bargeld dabeihaben.",
              },
              {
                label: "Unterwegs",
                body: "Grab ist die App für Fahrten und Essen.",
              },
              {
                label: "Rund um Hoi An",
                body: "Die Altstadt ist 5 km entfernt — Laternen, fantastisches Essen und die besten Schneider, Lederwaren und Silberschmiede. Der An-Bang-Strand, die Marmorberge und Da Nang liegen ganz in der Nähe.",
              },
            ],
          },
        ],
      },
    ],
  },

  agenda: {
    eyebrow: "Das Wochenende",
    title: "Ablauf",
    pickPrompt: "Klickt auf die Bilder für den genauen Ablauf",
    pickNote: "Die genauen Uhrzeiten bestätigen wir kurz vorher",
    daysLabel: "Tag wählen",
    days: [
      {
        date: "27. März",
        title: "Hochzeitstag",
        items: [
          { title: "Check-in", note: "Euer Zimmer im NHAAN ist bereit" },
          { title: "Ankommen der Gäste" },
          { title: "Trauung am Fluss" },
          { title: "Sektempfang", note: "Fotos zur goldenen Stunde" },
          { title: "Hochzeitsdinner", note: "Reden & erster Tanz" },
          { title: "Party", note: "Bringt eure Tanzschuhe mit 💃" },
        ],
      },
      {
        date: "28. März",
        title: "Farewell Brunch",
        items: [
          { title: "Abschiedsbrunch", note: "Ein gemütlicher, sonniger Abschied (und Erholung)" },
          { title: "Check-out" },
        ],
      },
    ],
  },

  dresscode: {
    eyebrow: "Was ziehe ich an?",
    subtitle: "Jungle Glam 🌿",
    note: "Wir feiern zwischen Kokospalmen und dem Grün am Flussufer — also holen wir den Dschungel auf die Tanzfläche. Denkt üppig, kräftig und warm, aber trotzdem elegant. Mischt die Farben, stimmt sie aufeinander ab oder setzt ganz auf eine. Tropische Prints, Blättermuster und erdige Texturen sind sehr willkommen.",
    swatches: [
      { name: "Rubinrot" },
      { name: "Zinnoberrot" },
      { name: "Mandarine" },
      { name: "Oliv" },
      { name: "Dunkeloliv" },
    ],
    notes: [
      {
        label: "Für ihn",
        body: "Leinen- oder helle Anzüge in Oliv, Rost oder Creme; gemusterte oder tropische Hemden; eine Krawatte oder ein Einstecktuch in Bordeaux oder Orange. Krawatte optional.",
      },
      {
        label: "Für sie",
        body: "Fließende Midi- oder Maxikleider, Jumpsuits oder Zweiteiler in der Farbpalette — Satin, Chiffon und Leinen funktionieren bei der Hitze wunderbar.",
      },
      {
        label: "Accessoires",
        body: "Gold- oder Silberschmuck, geflochtene Taschen, Blumen im Haar — nur zu.",
      },
      {
        label: "Schuhe",
        body: "Ein Teil der Feier findet auf Rasen statt, also sind Blockabsätze, Keilabsätze oder flache Schuhe eure besten Freunde.",
      },
      {
        label: "Áo dài willkommen!",
        body: "Ein Áo dài in Oliv, Orange oder Weinrot wäre traumhaft. Hoi An ist berühmt für seine Schneider — fragt uns gern nach Empfehlungen.",
      },
      {
        label: "Farewell Brunch",
        body: "Smart Casual, Farbpalette optional.",
      },
      {
        label: "Bitte vermeiden",
        body: "Bitte verzichtet auf Weiß, Elfenbein und sehr blasse Pastelltöne.",
      },
    ],
  },

  rsvp: {
    title: "Seid ihr dabei?",
    note: "Bitte gebt uns Bescheid, damit wir Zimmer, Transport und Essen planen können.",
    deadline: "Bitte antwortet bis zum 6. Dezember 2026",
    fields: {
      name: { label: "Vollständiger Name", placeholder: "Euer vollständiger Name" },
      whatsapp: { label: "WhatsApp-Nummer", placeholder: "+49 151 2345 6789" },
      email: { label: "E-Mail", placeholder: "du@beispiel.de" },
      attending: {
        label: "Seid ihr dabei?",
        yes: "Wir kommen sehr gern",
        no: "Leider können wir nicht",
      },
      roomSharing: {
        label: "Habt ihr Wünsche, mit wem ihr ein Zimmer teilt?",
        hint: "Wir möchten unsere Hochzeit so persönlich wie möglich halten, deshalb können wir leider keine Begleitpersonen einladen. Wir organisieren eure Unterkunft in Doppel- und Zweibettzimmern — sagt uns also gern, mit wem ihr euch ein Zimmer teilen möchtet.",
        placeholder: "Mit wem ihr ein Zimmer teilen möchtet",
      },
      extendStay: {
        label: "Länger bleiben? (auf eigene Kosten)",
        placeholder: "An welche zusätzlichen Nächte ihr denkt",
      },
      dietary: {
        label: "Lebensmittelallergien oder Ernährungswünsche?",
        none: "Keine besonderen Wünsche",
        yes: "Ja, bitte angeben",
        placeholder: "Sagt uns, worauf wir achten sollen",
      },
    },
    submit: "RSVP senden",
    sending: "Wird gesendet…",
    changeAnswer: "Antwort ändern",
    successTitle: "Danke!",
    successNote: "Wir haben eure Antwort — bis bald in Hoi An.",
    errorNote: "Das hat leider nicht geklappt. Bitte versucht es noch einmal.",
    declineNote:
      "Ihr könnt nicht kommen? Wir werden euch vermissen — und in Hoi An ein Glas auf euch erheben.",
    greeting: "Liebe/r",
  },

  gifts: {
    eyebrow: "Geschenke",
    title: "Flitterwochen-Fonds",
    jarPrompt: { open: "Tippen zum Schließen" },
    highlight: ["tippt auf das Gefäß"],
    intro:
      "Dass ihr den weiten Weg auf euch nehmt, um mit uns zu feiern, ist wirklich das größte Geschenk — ihr müsst nichts weiter mitbringen. Wenn ihr uns trotzdem etwas schenken möchtet, tippt auf das Gefäß für ein paar Ideen — ganz wie es sich für euch richtig anfühlt.",
    options: [
      {
        title: "Flitterwochen-Fonds",
        body: "Ein Beitrag zu unseren Flitterwochen würde uns helfen, Erinnerungen zu schaffen, die wir ein Leben lang schätzen werden. Wenn ihr etwas beitragen möchtet, gibt es am Empfangstisch PayPal oder einen QR-Code. Wenn ihr Bargeld mitbringt, steht dort auch eine Box für euren Umschlag bereit.",
      },
      {
        title: "Ein Hochzeitsgeschenk",
        body: "Wenn ihr lieber etwas schenken möchtet, gibt es beim Empfang einen Geschenketisch. Da viele von euch fliegen, ist klein und leicht perfekt — ihr müsst nichts Großes in den Koffer quetschen! Ihr könnt uns auch nach der Hochzeit etwas schicken; schreibt uns einfach auf WhatsApp für unsere Adresse.",
      },
      {
        title: "Ein paar Zeilen",
        body: "Ehrlich gesagt bedeutet uns eine handgeschriebene Karte mit euren Wünschen genauso viel.",
      },
    ],
  },

  thankYou: {
    eyebrow: "Danke",
    title: "Bis bald am Fluss",
    paragraphs: [
      "Von ganzem Herzen danke, dass ihr den weiten Weg auf euch nehmt, um den Beginn unseres gemeinsamen Lebens mit uns zu feiern.",
      "Ihr seid die Menschen, die uns am nächsten stehen, und wir wären überglücklich, eure Gesichter auf unserer Hochzeit zu sehen.",
      "Wir haben euch lieb!",
    ],
    logoLabel: "Monogramm von Will und Tina",
    imageAlt: "Zwei Katzen servieren Wein, erst gelassen, dann erschrocken",
  },

  meta: {
    title: "Tina & Will — 27. März 2027, Hoi An",
    description:
      "Feiert mit Tina & Will ein Wochenende voller Liebe, gutem Essen und Freude am Fluss in Hoi An, Vietnam — Samstag, 27. März 2027.",
    locale: "de_DE",
    lang: "de",
  },
};
