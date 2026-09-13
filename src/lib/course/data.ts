import type {
  Category,
  Dialogue,
  ErrorQuestion,
  GenderQuestion,
  GrammarLesson,
  SentenceQuestion,
  TrapQuestion,
} from "./types";

export const STORAGE_KEY_CATEGORIES = "spanish_categories_v3" as const;
export const STORAGE_KEY_STATS = "spanish_stats_v2" as const;
export const STORAGE_KEY_MISTAKES = "spanish_mistakes_v1" as const;
export const STORAGE_KEY_SETTINGS = "spanish_settings_v1" as const;

export const PRESET_COLORS: readonly string[] = ["#FF6B35", "#4ECDC4", "#FFD93D", "#FF8B94", "#C3B1E1", "#87CEEB", "#98D8C8", "#A8E6CF"];

export const CATEGORY_ICONS: Record<string, string> = {
  travel: "✈",
  city: "🏙",
  school: "📚",
  weather: "🌤",
  food: "🛒",
  phrases: "💬",
  greetings: "👋",
  opposites: "⇄",
  u2_home: "🏠",
  u2_time: "⏰",
  u2_transport: "🚌",
  u2_sport: "⚽",
  u2_hobbies: "🎨",
  u2_education: "🎓",
  u2_restaurant: "🍽",
  u2_expressions: "💡",
  u2_nature: "🌳",
};

export const GRAMMAR_LESSONS: GrammarLesson[] = [
      {
        id: "articles", title: "Άρθρα", subtitle: "el, la, los, las",
        intro: "Τα άρθρα συμφωνούν με το γένος και τον αριθμό του ουσιαστικού.",
        points: ["el = ο, για αρσενικό ενικό", "la = η, για θηλυκό ενικό", "los = οι/τα, για αρσενικό πληθυντικό", "las = οι, για θηλυκό πληθυντικό"],
        examples: ["el libro — το βιβλίο", "la casa — το σπίτι", "los libros — τα βιβλία", "las casas — τα σπίτια"],
        questions: [
          { prompt: "___ casa es grande.", answer: "La", options: ["El", "La", "Los", "Las"], explanation: "Casa είναι θηλυκό ενικό, άρα χρησιμοποιούμε la." },
          { prompt: "___ libros están aquí.", answer: "Los", options: ["El", "La", "Los", "Las"], explanation: "Libros είναι αρσενικό πληθυντικό, άρα usamos los." },
          { prompt: "___ ventanas son grandes.", answer: "Las", options: ["El", "La", "Los", "Las"], explanation: "Ventanas είναι θηλυκό πληθυντικό, άρα χρησιμοποιούμε las." }
        ]
      },
      {
        id: "gender", title: "Γένη", subtitle: "Αρσενικό και θηλυκό",
        intro: "Τα ισπανικά ουσιαστικά έχουν γένος. Συχνά οι λέξεις σε -o είναι αρσενικές και οι λέξεις σε -a είναι θηλυκές.",
        points: ["el chico — το αγόρι", "la chica — το κορίτσι", "Πρόσεχε τις εξαιρέσεις, όπως la mano", "Το άρθρο βοηθά να θυμάσαι το γένος"],
        examples: ["el gato — η γάτα", "la mesa — το τραπέζι", "el problema — το πρόβλημα"],
        questions: [
          { prompt: "Ποιο είναι το γένος της λέξης «mesa»;", answer: "Θηλυκό", options: ["Αρσενικό", "Θηλυκό"], explanation: "Λέμε la mesa, επομένως mesa είναι θηλυκό." },
          { prompt: "Ποιο άρθρο ταιριάζει: ___ problema;", answer: "el", options: ["el", "la", "los", "las"], explanation: "Λέμε el problema. Είναι αρσενική εξαίρεση παρότι τελειώνει σε -a." },
          { prompt: "Ποιο είναι το γένος της λέξης «libro»;", answer: "Αρσενικό", options: ["Αρσενικό", "Θηλυκό"], explanation: "Λέμε el libro, επομένως libro είναι αρσενικό." }
        ]
      },
      {
        id: "ser-estar", title: "Ser και estar", subtitle: "Είμαι / βρίσκομαι",
        intro: "Το ser χρησιμοποιείται κυρίως για ταυτότητα και μόνιμα χαρακτηριστικά. Το estar χρησιμοποιείται για κατάσταση ή τοποθεσία.",
        points: ["Yo soy — εγώ είμαι", "Tú eres — εσύ είσαι", "Yo estoy — εγώ βρίσκομαι/είμαι", "Tú estás — εσύ βρίσκεσαι/είσαι"],
        examples: ["Soy griego. — Είμαι Έλληνας.", "Estoy en casa. — Είμαι στο σπίτι.", "Ella está cansada. — Αυτή είναι κουρασμένη."],
        questions: [
          { prompt: "Yo ___ griego.", answer: "soy", options: ["soy", "estoy", "eres", "estás"], explanation: "Για ταυτότητα ή καταγωγή χρησιμοποιούμε ser: Yo soy." },
          { prompt: "Ella ___ en casa.", answer: "está", options: ["es", "está", "son", "están"], explanation: "Για τοποθεσία χρησιμοποιούμε estar: Ella está." },
          { prompt: "Nosotros ___ estudiantes.", answer: "somos", options: ["somos", "estamos", "sois", "estáis"], explanation: "Η ταυτότητα/ιδιότητα παίρνει ser: Nosotros somos." }
        ]
      },
      {
        id: "present", title: "Ενεστώτας", subtitle: "Βασικές καταλήξεις ρημάτων",
        intro: "Στον ενεστώτα αλλάζει η κατάληξη του ρήματος ανάλογα με το πρόσωπο.",
        points: ["-ar: hablo, hablas, habla", "-er: como, comes, come", "-ir: vivo, vives, vive", "Το υποκείμενο συχνά παραλείπεται γιατί φαίνεται από την κατάληξη"],
        examples: ["Yo hablo español. — Μιλάω ισπανικά.", "Tú comes pan. — Τρως ψωμί.", "Ella vive en Grecia. — Ζει στην Ελλάδα."],
        questions: [
          { prompt: "Yo ___ español. (hablar)", answer: "hablo", options: ["hablo", "hablas", "habla", "hablan"], explanation: "Στο yo, το hablar γίνεται hablo." },
          { prompt: "Tú ___ pan. (comer)", answer: "comes", options: ["como", "comes", "come", "comen"], explanation: "Στο tú, το comer γίνεται comes." },
          { prompt: "Ellos ___ en Madrid. (vivir)", answer: "viven", options: ["vivo", "vives", "vive", "viven"], explanation: "Στο ellos, το vivir γίνεται viven." }
        ]
      },
      {
        id: "questions", title: "Βασικές ερωτήσεις", subtitle: "¿Qué?, ¿Dónde?, ¿Cómo;",
        intro: "Οι ερωτηματικές λέξεις βοηθούν να φτιάχνεις καθημερινές ερωτήσεις.",
        points: ["¿Qué? — Τι;", "¿Dónde? — Πού;", "¿Cómo? — Πώς;", "¿Cuándo? — Πότε;"],
        examples: ["¿Cómo estás? — Πώς είσαι;", "¿Dónde vives? — Πού μένεις;", "¿Qué haces? — Τι κάνεις;"],
        questions: [
          { prompt: "¿___ te llamas?", answer: "Cómo", options: ["Qué", "Dónde", "Cómo", "Cuándo"], explanation: "Η ερώτηση «Πώς σε λένε;» είναι ¿Cómo te llamas?" },
          { prompt: "¿___ vives?", answer: "Dónde", options: ["Qué", "Dónde", "Cómo", "Por qué"], explanation: "Για τόπο χρησιμοποιούμε dónde: ¿Dónde vives?" },
          { prompt: "¿___ haces?", answer: "Qué", options: ["Qué", "Dónde", "Cómo", "Cuándo"], explanation: "Για «Τι κάνεις;» χρησιμοποιούμε qué." }
        ]
      },
      {
        id: "negation", title: "Άρνηση", subtitle: "Το no πριν από το ρήμα",
        intro: "Για να κάνεις μια απλή άρνηση, βάζεις no ακριβώς πριν από το ρήμα.",
        points: ["no hablo — δεν μιλάω", "no tengo — δεν έχω", "no quiero — δεν θέλω", "Το no μένει ίδιο σε όλα τα πρόσωπα"],
        examples: ["No hablo inglés. — Δεν μιλάω αγγλικά.", "No tengo tiempo. — Δεν έχω χρόνο.", "No quiero café. — Δεν θέλω καφέ."],
        questions: [
          { prompt: "___ bebo café.", answer: "No", options: ["No", "Nada", "Nunca", "Sin"], explanation: "Η απλή άρνηση μπαίνει με no πριν από το ρήμα." },
          { prompt: "Ella ___ vive aquí.", answer: "no", options: ["no", "nunca", "nada", "ni"], explanation: "Το no μπαίνει πριν από το vive." },
          { prompt: "Nosotros ___ queremos salir.", answer: "no", options: ["no", "nunca", "sin", "nadie"], explanation: "Η πρόταση «δεν θέλουμε» είναι no queremos." }
        ]
      },
      {
        id: "plural", title: "Πληθυντικός", subtitle: "Πώς γίνονται οι λέξεις πολλές",
        intro: "Για τον πληθυντικό προσθέτουμε συνήθως -s μετά από φωνήεν και -es μετά από σύμφωνο.",
        points: ["casa → casas", "libro → libros", "papel → papeles", "Το άρθρο αλλάζει επίσης: el → los, la → las"],
        examples: ["una mesa → dos mesas", "un hotel → dos hoteles", "la ciudad → las ciudades"],
        questions: [
          { prompt: "una casa → dos ___", answer: "casas", options: ["casa", "casas", "cases", "casos"], explanation: "Η λέξη τελειώνει σε φωνήεν, άρα προσθέτουμε -s." },
          { prompt: "un papel → dos ___", answer: "papeles", options: ["papels", "papeles", "papals", "papel"], explanation: "Μετά από σύμφωνο προσθέτουμε -es." },
          { prompt: "la ciudad → ___ ciudades", answer: "las", options: ["el", "la", "los", "las"], explanation: "Το θηλυκό πληθυντικό άρθρο είναι las." }
        ]
      }
    ];

export const DIALOGUES: Dialogue[] = [
      { id:"greeting", icon:"👋", title:"Χαιρετισμός", subtitle:"Γνωρίζεις κάποιον για πρώτη φορά", turns:[
        { speaker:"Ana", es:"¡Hola! ¿Cómo estás?", gr:"Γεια! Πώς είσαι;", choices:[
          {es:"Hola, bien, gracias. ¿Y tú?", gr:"Γεια, καλά, ευχαριστώ. Κι εσύ;", correct:true},
          {es:"Quiero una habitación.", gr:"Θέλω ένα δωμάτιο."},
          {es:"La cuenta, por favor.", gr:"Τον λογαριασμό, παρακαλώ."}
        ]},
        { speaker:"Ana", es:"Me llamo Ana. ¿Cómo te llamas?", gr:"Με λένε Ana. Εσένα πώς σε λένε;", choices:[
          {es:"Me llamo ___.", gr:"Με λένε ___", correct:true},
          {es:"Tengo hambre.", gr:"Πεινάω."},
          {es:"Está a la derecha.", gr:"Είναι στα δεξιά."}
        ]},
        { speaker:"Ana", es:"¡Mucho gusto!", gr:"Χάρηκα πολύ!", choices:[
          {es:"¡Mucho gusto!", gr:"Χάρηκα πολύ!", correct:true},
          {es:"No entiendo.", gr:"Δεν καταλαβαίνω."},
          {es:"Está cerrado.", gr:"Είναι κλειστό."}
        ]}
      ]},
      { id:"cafe", icon:"☕", title:"Στην καφετέρια", subtitle:"Παραγγέλνεις κάτι απλό", turns:[
        { speaker:"Camarero", es:"Buenos días. ¿Qué quieres?", gr:"Καλημέρα. Τι θέλεις;", choices:[
          {es:"Quiero un café, por favor.", gr:"Θέλω έναν καφέ, παρακαλώ.", correct:true},
          {es:"¿Dónde está el hotel?", gr:"Πού είναι το ξενοδοχείο;"},
          {es:"Soy de Grecia.", gr:"Είμαι από την Ελλάδα."}
        ]},
        { speaker:"Camarero", es:"¿Algo más?", gr:"Κάτι άλλο;", choices:[
          {es:"Sí, una botella de agua.", gr:"Ναι, ένα μπουκάλι νερό.", correct:true},
          {es:"Me llamo María.", gr:"Με λένε Μαρία."},
          {es:"No tengo pasaporte.", gr:"Δεν έχω διαβατήριο."}
        ]},
        { speaker:"Camarero", es:"Son cinco euros.", gr:"Είναι πέντε ευρώ.", choices:[
          {es:"Aquí tiene. Gracias.", gr:"Ορίστε. Ευχαριστώ.", correct:true},
          {es:"¿Cómo te llamas?", gr:"Πώς σε λένε;"},
          {es:"Hace frío.", gr:"Κάνει κρύο."}
        ]}
      ]},
      { id:"hotel", icon:"🏨", title:"Στο ξενοδοχείο", subtitle:"Κάνεις check-in", turns:[
        { speaker:"Recepcionista", es:"Buenas tardes. ¿Tiene una reserva?", gr:"Καλησπέρα. Έχετε κράτηση;", choices:[
          {es:"Sí, tengo una reserva.", gr:"Ναι, έχω κράτηση.", correct:true},
          {es:"Quiero comprar fruta.", gr:"Θέλω να αγοράσω φρούτα."},
          {es:"Estoy en la farmacia.", gr:"Είμαι στο φαρμακείο."}
        ]},
        { speaker:"Recepcionista", es:"¿Cuál es su nombre?", gr:"Ποιο είναι το όνομά σας;", choices:[
          {es:"Mi nombre es Nikos.", gr:"Το όνομά μου είναι Νίκος.", correct:true},
          {es:"La habitación es grande.", gr:"Το δωμάτιο είναι μεγάλο."},
          {es:"No quiero café.", gr:"Δεν θέλω καφέ."}
        ]},
        { speaker:"Recepcionista", es:"Aquí tiene la llave.", gr:"Ορίστε το κλειδί.", choices:[
          {es:"Gracias. ¿Dónde está la habitación?", gr:"Ευχαριστώ. Πού είναι το δωμάτιο;", correct:true},
          {es:"¿Cuánto cuesta la manzana?", gr:"Πόσο κοστίζει το μήλο;"},
          {es:"Soy estudiante.", gr:"Είμαι μαθητής."}
        ]}
      ]},
      { id:"directions", icon:"✈️", title:"Στο ταξίδι", subtitle:"Ρωτάς για τον δρόμο", turns:[
        { speaker:"Tú", es:"Perdón, ¿dónde está la estación?", gr:"Συγγνώμη, πού είναι ο σταθμός;", choices:[
          {es:"¿Está cerca?", gr:"Είναι κοντά;", correct:true},
          {es:"Quiero una naranja.", gr:"Θέλω ένα πορτοκάλι."},
          {es:"Soy profesor.", gr:"Είμαι καθηγητής."}
        ]},
        { speaker:"Persona", es:"Sí, está a la derecha.", gr:"Ναι, είναι στα δεξιά.", choices:[
          {es:"Muchas gracias.", gr:"Ευχαριστώ πολύ.", correct:true},
          {es:"Tengo una habitación.", gr:"Έχω ένα δωμάτιο."},
          {es:"No me llamo Ana.", gr:"Δεν με λένε Ana."}
        ]}
      ]},
      { id:"introduction", icon:"🤝", title:"Γνωριμία", subtitle:"Μιλάς για τον εαυτό σου", turns:[
        { speaker:"Luis", es:"¿De dónde eres?", gr:"Από πού είσαι;", choices:[
          {es:"Soy de Grecia.", gr:"Είμαι από την Ελλάδα.", correct:true},
          {es:"Estoy cansado.", gr:"Είμαι κουρασμένος."},
          {es:"Quiero dos billetes.", gr:"Θέλω δύο εισιτήρια."}
        ]},
        { speaker:"Luis", es:"¿Qué haces?", gr:"Τι κάνεις;", choices:[
          {es:"Estudio español.", gr:"Μελετώ ισπανικά.", correct:true},
          {es:"La calle está cerca.", gr:"Ο δρόμος είναι κοντά."},
          {es:"Cuesta diez euros.", gr:"Κοστίζει δέκα ευρώ."}
        ]}
      ]},
      { id:"shopping", icon:"🛍️", title:"Στα ψώνια", subtitle:"Ρωτάς τιμή και μέγεθος", turns:[
        { speaker:"Vendedor", es:"Hola. ¿Puedo ayudarte?", gr:"Γεια. Μπορώ να σε βοηθήσω;", choices:[
          {es:"Sí, busco una camiseta.", gr:"Ναι, ψάχνω μια μπλούζα.", correct:true},
          {es:"Estoy en Madrid.", gr:"Είμαι στη Μαδρίτη."},
          {es:"No hablo francés.", gr:"Δεν μιλάω γαλλικά."}
        ]},
        { speaker:"Vendedor", es:"¿Cuánto necesitas?", gr:"Πόσο χρειάζεσαι;", choices:[
          {es:"Necesito una talla grande.", gr:"Χρειάζομαι ένα μεγάλο νούμερο.", correct:true},
          {es:"Buenos días.", gr:"Καλημέρα."},
          {es:"El museo está allí.", gr:"Το μουσείο είναι εκεί."}
        ]}
      ]},
      { id:"doctor", icon:"🩺", title:"Στον γιατρό", subtitle:"Περιγράφεις πώς νιώθεις", turns:[
        { speaker:"Doctora", es:"¿Qué te pasa?", gr:"Τι έχεις;", choices:[
          {es:"Me duele la cabeza.", gr:"Με πονάει το κεφάλι.", correct:true},
          {es:"Quiero un billete.", gr:"Θέλω ένα εισιτήριο."},
          {es:"La tienda está abierta.", gr:"Το κατάστημα είναι ανοιχτό."}
        ]},
        { speaker:"Doctora", es:"¿Tienes fiebre?", gr:"Έχεις πυρετό;", choices:[
          {es:"Sí, tengo un poco de fiebre.", gr:"Ναι, έχω λίγο πυρετό.", correct:true},
          {es:"Me llamo Carlos.", gr:"Με λένε Carlos."},
          {es:"Está al lado.", gr:"Είναι δίπλα."}
        ]}
      ]},
      { id:"work", icon:"💼", title:"Στη δουλειά", subtitle:"Μιλάς για το πρόγραμμά σου", turns:[
        { speaker:"Compañero", es:"¿Trabajas hoy?", gr:"Δουλεύεις σήμερα;", choices:[
          {es:"Sí, trabajo por la mañana.", gr:"Ναι, δουλεύω το πρωί.", correct:true},
          {es:"Quiero una mesa.", gr:"Θέλω ένα τραπέζι."},
          {es:"La nieve es blanca.", gr:"Το χιόνι είναι λευκό."}
        ]},
        { speaker:"Compañero", es:"¿Tienes mucho trabajo?", gr:"Έχεις πολλή δουλειά;", choices:[
          {es:"Sí, pero estoy bien.", gr:"Ναι, αλλά είμαι καλά.", correct:true},
          {es:"Está en la mochila.", gr:"Είναι στο σακίδιο."},
          {es:"Buenas noches.", gr:"Καληνύχτα."}
        ]}
      ]}
    ];

export const SENTENCE_QUESTIONS: SentenceQuestion[] = [
      { prompt:'Συμπλήρωσε: «Yo ___ español.»', answer:"hablo", gr:"μιλάω", item:{es:"hablo",gr:"μιλάω"} },
      { prompt:'Συμπλήρωσε: «Quiero ___ un café.»', answer:"tomar", gr:"να πάρω", item:{es:"tomar",gr:"να πάρω"} },
      { prompt:'Συμπλήρωσε: «La casa ___ grande.»', answer:"es", gr:"είναι", item:{es:"es",gr:"είναι"} },
      { prompt:'Συμπλήρωσε: «¿Dónde ___ la estación?»', answer:"está", gr:"βρίσκεται", item:{es:"está",gr:"βρίσκεται"} },
      { prompt:'Συμπλήρωσε: «Nosotros ___ estudiantes.»', answer:"somos", gr:"είμαστε", item:{es:"somos",gr:"είμαστε"} },
      { prompt:'Συμπλήρωσε: «Ella ___ en casa.»', answer:"está", gr:"βρίσκεται", item:{es:"está",gr:"βρίσκεται"} },
      { prompt:'Συμπλήρωσε: «Tú ___ pan.»', answer:"comes", gr:"τρως", item:{es:"comes",gr:"τρως"} },
      { prompt:'Συμπλήρωσε: «Ellos ___ en Madrid.»', answer:"viven", gr:"ζουν", item:{es:"viven",gr:"ζουν"} },
      { prompt:'Συμπλήρωσε: «___ tengo tiempo.»', answer:"No", gr:"δεν", item:{es:"no",gr:"δεν"} },
      { prompt:'Συμπλήρωσε: «¿___ te llamas?»', answer:"Cómo", gr:"πώς", item:{es:"cómo",gr:"πώς"} },
      { prompt:'Συμπλήρωσε: «¿___ vives?»', answer:"Dónde", gr:"πού", item:{es:"dónde",gr:"πού"} },
      { prompt:'Συμπλήρωσε: «¿___ haces?»', answer:"Qué", gr:"τι", item:{es:"qué",gr:"τι"} },
      { prompt:'Συμπλήρωσε: «Yo ___ de Grecia.»', answer:"soy", gr:"είμαι", item:{es:"soy",gr:"είμαι"} },
      { prompt:'Συμπλήρωσε: «Necesito ___ agua.»', answer:"comprar", gr:"να αγοράσω", item:{es:"comprar",gr:"αγοράζω"} },
      { prompt:'Συμπλήρωσε: «Hay una ___ cerca.»', answer:"tienda", gr:"κατάστημα", item:{es:"tienda",gr:"κατάστημα"} },
      { prompt:'Συμπλήρωσε: «Voy a la ___ .»', answer:"escuela", gr:"σχολείο", item:{es:"escuela",gr:"σχολείο"} },
      { prompt:'Συμπλήρωσε: «Tengo una ___ .»', answer:"mochila", gr:"σακίδιο", item:{es:"mochila",gr:"σακίδιο"} },
      { prompt:'Συμπλήρωσε: «Hace ___ hoy.»', answer:"frío", gr:"κρύο", item:{es:"frío",gr:"κρύο"} },
      { prompt:'Συμπλήρωσε: «Quiero una ___ de agua.»', answer:"botella", gr:"μπουκάλι", item:{es:"botella",gr:"μπουκάλι"} },
      { prompt:'Συμπλήρωσε: «La estación está a la ___ .»', answer:"derecha", gr:"δεξιά", item:{es:"derecha",gr:"δεξιά"} },
      { prompt:'Συμπλήρωσε: «Me ___ la cabeza.»', answer:"duele", gr:"πονάει", item:{es:"duele",gr:"πονάει"} },
      { prompt:'Συμπλήρωσε: «Trabajo por la ___ .»', answer:"mañana", gr:"πρωί", item:{es:"mañana",gr:"πρωί"} },
      { prompt:'Συμπλήρωσε: «Estudio ___ todos los días.»', answer:"español", gr:"ισπανικά", item:{es:"español",gr:"ισπανικά"} },
      { prompt:'Συμπλήρωσε: «La cuenta, por ___ .»', answer:"favor", gr:"παρακαλώ", item:{es:"por favor",gr:"παρακαλώ"} },
    ];

export const ERROR_QUESTIONS: ErrorQuestion[] = [
      { prompt:"Διόρθωσε: «Yo es de Grecia.»", answer:"Yo soy de Grecia.", options:["Yo soy de Grecia.","Yo estoy de Grecia.","Yo eres de Grecia."], item:{es:"soy",gr:"είμαι"} },
      { prompt:"Διόρθωσε: «La libro es nuevo.»", answer:"El libro es nuevo.", options:["El libro es nuevo.","La libro está nuevo.","Los libro es nuevo."], item:{es:"el libro",gr:"το βιβλίο"} },
      { prompt:"Διόρθωσε: «No tengo nada tiempo.»", answer:"No tengo tiempo.", options:["No tengo tiempo.","No tiempo tengo.","No soy tiempo."], item:{es:"tiempo",gr:"χρόνος"} },
      { prompt:"Διόρθωσε: «Ella soy profesora.»", answer:"Ella es profesora.", options:["Ella es profesora.","Ella estoy profesora.","Ella eres profesora."], item:{es:"es",gr:"είναι"} },
      { prompt:"Διόρθωσε: «Nosotros está en casa.»", answer:"Nosotros estamos en casa.", options:["Nosotros estamos en casa.","Nosotros somos en casa.","Nosotros estáis en casa."], item:{es:"estamos",gr:"βρισκόμαστε"} },
      { prompt:"Διόρθωσε: «Tú hablo español.»", answer:"Tú hablas español.", options:["Tú hablas español.","Tú habla español.","Tú hablan español."], item:{es:"hablas",gr:"μιλάς"} },
      { prompt:"Διόρθωσε: «Los casa son grandes.»", answer:"Las casas son grandes.", options:["Las casas son grandes.","Los casas son grandes.","El casas son grandes."], item:{es:"las casas",gr:"τα σπίτια"} },
      { prompt:"Διόρθωσε: «¿Cómo estás llamado?»", answer:"¿Cómo te llamas?", options:["¿Cómo te llamas?","¿Qué te llamas?","¿Dónde te llamas?"], item:{es:"llamarse",gr:"ονομάζομαι"} },
      { prompt:"Διόρθωσε: «Yo no quiero no café.»", answer:"Yo no quiero café.", options:["Yo no quiero café.","Yo quiero no café.","Yo no café quiero."], item:{es:"no quiero",gr:"δεν θέλω"} },
      { prompt:"Διόρθωσε: «Hay dos hotel.»", answer:"Hay dos hoteles.", options:["Hay dos hoteles.","Hay dos hotels.","Hay dos hotelos."], item:{es:"hoteles",gr:"ξενοδοχεία"} },
      { prompt:"Διόρθωσε: «Estoy griego.»", answer:"Soy griego.", options:["Soy griego.","Estoy de griego.","Somos griego."], item:{es:"soy",gr:"είμαι"} },
      { prompt:"Διόρθωσε: «La problema es difícil.»", answer:"El problema es difícil.", options:["El problema es difícil.","Los problema es difícil.","La problemas es difícil."], item:{es:"el problema",gr:"το πρόβλημα"} },
      { prompt:"Διόρθωσε: «Ellos comes pan.»", answer:"Ellos comen pan.", options:["Ellos comen pan.","Ellos come pan.","Ellos como pan."], item:{es:"comen",gr:"τρώνε"} },
      { prompt:"Διόρθωσε: «¿Qué estás?»", answer:"¿Cómo estás?", options:["¿Cómo estás?","¿Dónde estás?","¿Cuándo estás?"], item:{es:"cómo estás",gr:"πώς είσαι"} },
      { prompt:"Διόρθωσε: «Una papel, por favor.»", answer:"Un papel, por favor.", options:["Un papel, por favor.","Una papeles, por favor.","El papelas, por favor."], item:{es:"un papel",gr:"ένα χαρτί"} },
    ];

export const GENDER_QUESTIONS: GenderQuestion[] = [
      { prompt:"Ποιο άρθρο ταιριάζει: ___ casa;", answer:"la", options:["el","la","los","las"], item:{es:"la casa",gr:"το σπίτι"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ libro;", answer:"el", options:["el","la","los","las"], item:{es:"el libro",gr:"το βιβλίο"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ ventanas;", answer:"las", options:["el","la","los","las"], item:{es:"las ventanas",gr:"τα παράθυρα"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ problema;", answer:"el", options:["el","la","los","las"], item:{es:"el problema",gr:"το πρόβλημα"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ mesa;", answer:"la", options:["el","la","los","las"], item:{es:"la mesa",gr:"το τραπέζι"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ hoteles;", answer:"los", options:["el","la","los","las"], item:{es:"los hoteles",gr:"τα ξενοδοχεία"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ mano;", answer:"la", options:["el","la","los","las"], item:{es:"la mano",gr:"το χέρι"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ día;", answer:"el", options:["el","la","los","las"], item:{es:"el día",gr:"η μέρα"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ escuelas;", answer:"las", options:["el","la","los","las"], item:{es:"las escuelas",gr:"τα σχολεία"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ agua;", answer:"el", options:["el","la","los","las"], item:{es:"el agua",gr:"το νερό"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ mochila;", answer:"la", options:["el","la","los","las"], item:{es:"la mochila",gr:"το σακίδιο"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ pasaporte;", answer:"el", options:["el","la","los","las"], item:{es:"el pasaporte",gr:"το διαβατήριο"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ ciudades;", answer:"las", options:["el","la","los","las"], item:{es:"las ciudades",gr:"οι πόλεις"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ restaurante;", answer:"el", options:["el","la","los","las"], item:{es:"el restaurante",gr:"το εστιατόριο"} },
      { prompt:"Ποιο άρθρο ταιριάζει: ___ plazas;", answer:"las", options:["el","la","los","las"], item:{es:"las plazas",gr:"οι πλατείες"} },
      { prompt:"Ποιο γένος έχει η λέξη «mapa»;", answer:"Αρσενικό", options:["Αρσενικό","Θηλυκό"], item:{es:"el mapa",gr:"ο χάρτης"} },
      { prompt:"Ποιο γένος έχει η λέξη «noche»;", answer:"Θηλυκό", options:["Αρσενικό","Θηλυκό"], item:{es:"la noche",gr:"η νύχτα"} },
      { prompt:"Ποιο γένος έχει η λέξη «papel»;", answer:"Αρσενικό", options:["Αρσενικό","Θηλυκό"], item:{es:"el papel",gr:"το χαρτί"} },
    ];

export const TRAP_QUESTIONS: TrapQuestion[] = [
      { prompt:"Ποια λέξη σημαίνει «βιβλιοθήκη»;", answer:"biblioteca", options:["biblioteca","librería","libro"], item:{es:"biblioteca",gr:"βιβλιοθήκη"} },
      { prompt:"Ποια λέξη σημαίνει «αυτή τη στιγμή»;", answer:"actualmente", options:["actualmente","actual","actuar"], item:{es:"actualmente",gr:"αυτή τη στιγμή"} },
      { prompt:"Ποια λέξη σημαίνει «χαλί»;", answer:"alfombra", options:["alfombra","carpeta","alfabeto"], item:{es:"alfombra",gr:"χαλί"} },
      { prompt:"Ποια λέξη σημαίνει «είμαι έγκυος»;", answer:"estoy embarazada", options:["estoy embarazada","estoy avergonzada","soy embarazada"], item:{es:"estoy embarazada",gr:"είμαι έγκυος"} },
      { prompt:"Ποια λέξη σημαίνει «βιβλιοπωλείο»;", answer:"librería", options:["librería","biblioteca","libre"], item:{es:"librería",gr:"βιβλιοπωλείο"} },
      { prompt:"Ποια λέξη σημαίνει «φάκελος / χαρτοφύλακας»;", answer:"carpeta", options:["carpeta","alfombra","carta"], item:{es:"carpeta",gr:"φάκελος"} },
      { prompt:"Ποια λέξη σημαίνει «επιτυχία»;", answer:"éxito", options:["éxito","salida","éxito rápido"], item:{es:"éxito",gr:"επιτυχία"} },
      { prompt:"Ποια φράση σημαίνει «είμαι ντροπιασμένος/η»;", answer:"estoy avergonzado/a", options:["estoy avergonzado/a","estoy embarazado/a","soy avergonzado/a"], item:{es:"avergonzado",gr:"ντροπιασμένος"} },
      { prompt:"Ποια λέξη σημαίνει «συνειδητοποιώ»;", answer:"darse cuenta", options:["darse cuenta","realizar","hacer real"], item:{es:"darse cuenta",gr:"συνειδητοποιώ"} },
      { prompt:"Ποια λέξη σημαίνει «παρακολουθώ / παρατήρηση»;", answer:"asistir", options:["asistir","atender","ayudar"], item:{es:"asistir",gr:"παρακολουθώ"} },
      { prompt:"Ποια λέξη σημαίνει «μεγάλος / μεγάλης κλίμακας» (όχι «grande»);", answer:"largo", options:["largo","grande","ancho"], item:{es:"largo",gr:"μακρύς"} },
      { prompt:"Ποια λέξη σημαίνει «ευαίσθητος»;", answer:"sensible", options:["sensible","sensato","sentimental"], item:{es:"sensible",gr:"ευαίσθητος"} },
      { prompt:"Ποια λέξη σημαίνει «λογικός / συνετός»;", answer:"sensato", options:["sensato","sensible","sentido"], item:{es:"sensato",gr:"συνετός"} },
      { prompt:"Ποια λέξη σημαίνει «εισιτήριο»;", answer:"billete", options:["billete","factura","cuenta"], item:{es:"billete",gr:"εισιτήριο"} },
      { prompt:"Ποια λέξη σημαίνει «λογαριασμός (σε εστιατόριο)»;", answer:"cuenta", options:["cuenta","billete","nota"], item:{es:"cuenta",gr:"λογαριασμός"} },
      { prompt:"Ποια λέξη σημαίνει «έξοδος»;", answer:"salida", options:["salida","éxito","entrada"], item:{es:"salida",gr:"έξοδος"} },
      { prompt:"Ποια λέξη σημαίνει «μεθυσμένος»;", answer:"borracho", options:["borracho","embriagado de éxito","mojado"], item:{es:"borracho",gr:"μεθυσμένος"} },
      { prompt:"Ποια λέξη σημαίνει «ρεκόρ / εγγραφή» ανάλογα με συγκείμενο — ποια είναι η σωστή για «ρεκόρ»;", answer:"récord", options:["récord","registro","grabación"], item:{es:"récord",gr:"ρεκόρ"} },
      { prompt:"Ποια λέξη σημαίνει «γονείς»;", answer:"padres", options:["padres","parientes","papás solo"], item:{es:"padres",gr:"γονείς"} },
      { prompt:"Ποια λέξη σημαίνει «συγγενείς»;", answer:"parientes", options:["parientes","padres","familiares lejanos solo"], item:{es:"parientes",gr:"συγγενείς"} },
      { prompt:"Ποια λέξη σημαίνει «να γνωρίσω κάποιον» (πρώτη φορά);", answer:"conocer", options:["conocer","saber","aprender"], item:{es:"conocer",gr:"γνωρίζω"} },
      { prompt:"Ποια λέξη σημαίνει «να ξέρω μια πληροφορία»;", answer:"saber", options:["saber","conocer","entender solo"], item:{es:"saber",gr:"ξέρω"} },
      { prompt:"Ποια λέξη σημαίνει «ώρα του ρολογιού»;", answer:"hora", options:["hora","tiempo","vez"], item:{es:"hora",gr:"ώρα"} },
      { prompt:"Ποια λέξη σημαίνει «καιρός / χρόνος γενικά»;", answer:"tiempo", options:["tiempo","hora","reloj"], item:{es:"tiempo",gr:"χρόνος"} },
    ];

export const UNIT1_CATEGORIES: Category[] = [
      { id:"travel", name:"Ταξίδι & Ρούχα", color:"#FF6B35", unit:1, items:[
        {es:"suéter",gr:"πουλόβερ"},{es:"chaqueta",gr:"σακάκι"},{es:"gorra",gr:"καπέλο"},{es:"mochila",gr:"σακίδιο"},
        {es:"maleta",gr:"βαλίτσα"},{es:"pasaporte",gr:"διαβατήριο"},{es:"cargador",gr:"φορτιστής"},{es:"dinero",gr:"χρήματα"},
        {es:"equipaje",gr:"αποσκευές"},{es:"camiseta",gr:"μπλούζα"},{es:"pantalones",gr:"παντελόνια"},{es:"zapatos",gr:"παπούτσια"},
        {es:"bufanda",gr:"κασκόλ"},{es:"guantes",gr:"γάντια"},{es:"billete",gr:"εισιτήριο"},{es:"tarjeta",gr:"κάρτα"}
      ]},
      { id:"city", name:"Πόλη & Μέρη", color:"#4ECDC4", unit:1, items:[
        {es:"banco",gr:"τράπεζα"},{es:"cerca",gr:"κοντά"},{es:"pueblo",gr:"χωριό"},{es:"museo",gr:"μουσείο"},{es:"ciudad",gr:"πόλη"},
        {es:"tienda",gr:"κατάστημα"},{es:"panadería",gr:"αρτοποιείο"},{es:"barrio",gr:"γειτονιά"},{es:"teatro",gr:"θέατρο"},
        {es:"parque",gr:"πάρκο"},{es:"restaurante",gr:"εστιατόριο"},{es:"cafetería",gr:"καφετέρια"},{es:"hospital",gr:"νοσοκομείο"},
        {es:"farmacia",gr:"φαρμακείο"},{es:"plaza",gr:"πλατεία"},{es:"calle",gr:"δρόμος"},{es:"centro",gr:"κέντρο"}
      ]},
      { id:"school", name:"Σχολείο & Γλώσσες", color:"#A8E6CF", unit:1, items:[
        {es:"estudio",gr:"μελετώ"},{es:"inglés",gr:"αγγλικά"},{es:"español",gr:"ισπανικά"},{es:"alemán",gr:"γερμανικά"},
        {es:"francés",gr:"γαλλικά"},{es:"griego",gr:"ελληνικά"},{es:"arte",gr:"τέχνη"},{es:"música",gr:"μουσική"},
        {es:"escuela",gr:"σχολείο"},{es:"libro",gr:"βιβλίο"},{es:"aprendo",gr:"μαθαίνω"},{es:"profesor",gr:"καθηγητής"},
        {es:"clase",gr:"μάθημα"},{es:"examen",gr:"εξέταση"},{es:"tarea",gr:"εργασία"},{es:"por la mañana",gr:"το πρωί"},
        {es:"por la noche",gr:"το βράδυ"}
      ]},
      { id:"weather", name:"Καιρός & Εποχές", color:"#FFD93D", unit:1, items:[
        {es:"hace viento",gr:"φυσάει"},{es:"frío",gr:"κρύο"},{es:"calor",gr:"ζέστη"},{es:"sol",gr:"ήλιος"},{es:"primavera",gr:"άνοιξη"},
        {es:"otoño",gr:"φθινόπωρο"},{es:"invierno",gr:"χειμώνας"},{es:"verano",gr:"καλοκαίρι"},{es:"Julio",gr:"Ιούλιος"},
        {es:"Enero",gr:"Ιανουάριος"},{es:"Hace buen tiempo",gr:"κάνει καλό καιρό"},{es:"llueve",gr:"βρέχει"},{es:"nieva",gr:"χιονίζει"},
        {es:"nube",gr:"σύννεφο"},{es:"tormenta",gr:"καταιγίδα"}
      ]},
      { id:"food", name:"Φαγητό & Αγορά", color:"#FF8B94", unit:1, items:[
        {es:"durazno",gr:"ροδάκινο"},{es:"sandía",gr:"καρπούζι"},{es:"naranja",gr:"πορτοκάλι"},{es:"piña",gr:"ανανάς"},
        {es:"bolsa",gr:"σακούλα"},{es:"mercado",gr:"αγορά"},{es:"manzana",gr:"μήλο"},{es:"plátano",gr:"μπανάνα"},
        {es:"pera",gr:"αχλάδι"},{es:"verduras",gr:"λαχανικά"},{es:"precio",gr:"τιμή"},{es:"comprar",gr:"αγοράζω"}
      ]},
      { id:"phrases", name:"Φράσεις & Εκφράσεις", color:"#C3B1E1", unit:1, items:[
        {es:"mucho trabajo",gr:"πολύ δουλειά"},{es:"muy bien",gr:"πολύ καλά"},{es:"Claro",gr:"φυσικά"},{es:"En total",gr:"σύνολο"},
        {es:"Yo también",gr:"και εγώ"},{es:"¿Cuánto cuesta?",gr:"Πόσο κοστίζει;"},{es:"¿Dónde?",gr:"που;"},{es:"Perdón",gr:"Συγγνώμη"},
        {es:"Lo siento",gr:"Λυπάμαι"},{es:"¿Cómo estás?",gr:"πώς είσαι"},{es:"¿Qué tal?",gr:"πώς πάει"},{es:"necesito",gr:"χρειάζομαι"},
        {es:"Hay",gr:"υπάρχει"},{es:"Mira",gr:"κοίτα"},{es:"tranquilo/a",gr:"ήρεμος/η"}
      ]},
      { id:"greetings", name:"Χαιρετισμοί", color:"#87CEEB", unit:1, items:[
        {es:"Hola",gr:"Γεια"},{es:"Buenos días",gr:"Καλημέρα"},{es:"Buenas tardes",gr:"Καλησπέρα"},{es:"Buenas noches",gr:"Καληνύχτα"},
        {es:"Bien, gracias",gr:"Καλά, ευχαριστώ"},{es:"¿Y tú?",gr:"Κι εσύ;"},{es:"Adiós",gr:"Αντίο"},{es:"Hasta luego",gr:"Τα λέμε αργότερα"}
      ]},
      { id:"opposites", name:"Αντίθετα", color:"#98D8C8", unit:1, items:[
        {es:"mucho – poco",gr:"πολύ – λίγο"},{es:"bien – mal",gr:"καλά – άσχημα"},{es:"sí – no",gr:"ναι – όχι"},
        {es:"grande – pequeño",gr:"μεγάλο – μικρό"},{es:"rápido – lento",gr:"γρήγορο – αργό"},{es:"alto – bajo",gr:"ψηλό – χαμηλό"},
        {es:"nuevo – viejo",gr:"καινούριο – παλιό"},{es:"fácil – difícil",gr:"εύκολο – δύσκολο"},{es:"abierto – cerrado",gr:"ανοιχτό – κλειστό"},
        {es:"día – noche",gr:"μέρα – νύχτα"}
      ]}
    ];

export const UNIT2_CATEGORIES: Category[] = [
      { id:"u2_home", name:"Σπίτι & Πόλη", color:"#FF6B35", unit:2, items:[
        {es:"familia",gr:"οικογένεια"},{es:"casa",gr:"σπίτι"},{es:"edificio",gr:"κτίριο"},{es:"apartamento",gr:"διαμέρισμα"},
        {es:"piso",gr:"όροφος"},{es:"habitación",gr:"δωμάτιο"},{es:"calle",gr:"δρόμος"},{es:"vecino",gr:"γείτονας"},
        {es:"supermercado",gr:"σούπερ μάρκετ"},{es:"librería",gr:"βιβλιοπωλείο"},{es:"biblioteca",gr:"βιβλιοθήκη"},{es:"puerta",gr:"πόρτα"},
        {es:"ventana",gr:"παράθυρο"},{es:"cocina",gr:"κουζίνα"},{es:"baño",gr:"μπάνιο"},{es:"ciudad",gr:"πόλη"}
      ]},
      { id:"u2_time", name:"Χρόνος & Καθημερινότητα", color:"#4ECDC4", unit:2, items:[
        {es:"ahora",gr:"τώρα"},{es:"tiempo libre",gr:"ελεύθερος χρόνος"},{es:"por la tarde",gr:"το απόγευμα"},{es:"todos los días",gr:"κάθε μέρα"},
        {es:"frecuentemente",gr:"συχνά"},{es:"a menudo",gr:"συχνά"},{es:"entonces",gr:"τότε"},{es:"hoy",gr:"σήμερα"},
        {es:"mañana",gr:"αύριο"},{es:"ayer",gr:"χθες"},{es:"temprano",gr:"νωρίς"},{es:"tarde",gr:"αργά"}
      ]},
      { id:"u2_transport", name:"Μετακινήσεις", color:"#FFD93D", unit:2, items:[
        {es:"en coche",gr:"με αυτοκίνητο"},{es:"en tren",gr:"με τρένο"},{es:"en autobús",gr:"με λεωφορείο"},{es:"en avión",gr:"με αεροπλάνο"},
        {es:"a pie",gr:"με τα πόδια"},{es:"bicicleta",gr:"ποδήλατο"}
      ]},
      { id:"u2_sport", name:"Αθλητισμός & Γυμναστική", color:"#A8E6CF", unit:2, items:[
        {es:"gimnasio",gr:"γυμναστήριο"},{es:"fútbol",gr:"ποδόσφαιρο"},{es:"básquetbol",gr:"μπάσκετ"},{es:"tenis",gr:"τένις"},
        {es:"béisbol",gr:"μπέιζμπολ"},{es:"piscina",gr:"πισίνα"},{es:"entrenador",gr:"προπονητής"},{es:"atlético",gr:"αθλητικός"},
        {es:"correr",gr:"τρέχω"},{es:"ejercicio",gr:"άσκηση"},{es:"competir",gr:"αγωνίζομαι"},{es:"partido",gr:"αγώνας"},
        {es:"nado",gr:"κολυμπάω"},{es:"levanto pesas",gr:"σηκώνω βάρη"},{es:"descanso",gr:"ξεκουράζομαι"}
      ]},
      { id:"u2_hobbies", name:"Χόμπι & Δραστηριότητες", color:"#C3B1E1", unit:2, items:[
        {es:"dibujo",gr:"ζωγραφίζω"},{es:"patinas",gr:"κάνεις πατινάζ"},{es:"pescas",gr:"ψαρεύεις"},{es:"películas",gr:"ταινίες"},
        {es:"música",gr:"μουσική"},{es:"leer",gr:"διαβάζω"},{es:"viajar",gr:"ταξιδεύω"},{es:"fotografía",gr:"φωτογραφία"}
      ]},
      { id:"u2_education", name:"Εκπαίδευση & Μαθήματα", color:"#87CEEB", unit:2, items:[
        {es:"colegio",gr:"σχολείο"},{es:"maestro",gr:"δάσκαλος"},{es:"director",gr:"διευθυντής"},{es:"curso",gr:"μάθημα"},
        {es:"lección",gr:"μάθημα"},{es:"ejercicios",gr:"ασκήσεις"},{es:"matemáticas",gr:"μαθηματικά"},{es:"química",gr:"χημεία"},
        {es:"historia",gr:"ιστορία"},{es:"literatura",gr:"λογοτεχνία"},{es:"árabe",gr:"αραβικά"},{es:"chino",gr:"κινέζικα"},
        {es:"japonés",gr:"ιαπωνικά"},{es:"examen",gr:"εξέταση"},{es:"estudiar",gr:"μελετώ"},{es:"aprender",gr:"μαθαίνω"},
        {es:"profesor",gr:"καθηγητής"}
      ]},
      { id:"u2_restaurant", name:"Φαγητό & Εστιατόριο", color:"#FF8B94", unit:2, items:[
        {es:"arroz",gr:"ρύζι"},{es:"pollo",gr:"κοτόπουλο"},{es:"carne",gr:"κρέας"},{es:"queso",gr:"τυρί"},{es:"verdura",gr:"λαχανικό"},
        {es:"papa",gr:"πατάτα"},{es:"frijol",gr:"φασόλι"},{es:"hamburguesa",gr:"μπέργκερ"},{es:"bebida",gr:"ποτό"},{es:"sal",gr:"αλάτι"},
        {es:"galleta",gr:"μπισκότο"},{es:"pastel",gr:"κέικ"},{es:"batido",gr:"μιλκσέικ"},{es:"cuenta",gr:"λογαριασμός"},
        {es:"agua",gr:"νερό"},{es:"pan",gr:"ψωμί"},{es:"fruta",gr:"φρούτο"},{es:"desayuno",gr:"πρωινό"},{es:"cena",gr:"βραδινό"}
      ]},
      { id:"u2_expressions", name:"Χρήσιμες Εκφράσεις", color:"#98D8C8", unit:2, items:[
        {es:"¿Por qué?",gr:"γιατί;"},{es:"bueno",gr:"λοιπόν"},{es:"pues",gr:"λοιπόν"},{es:"así es",gr:"έτσι είναι"},
        {es:"no importa",gr:"δεν πειράζει"},{es:"honestamente",gr:"ειλικρινά"},{es:"allí",gr:"εκεί"},{es:"claro",gr:"φυσικά"},
        {es:"por supuesto",gr:"βεβαίως"},{es:"tal vez",gr:"ίσως"},{es:"gracias",gr:"ευχαριστώ"},{es:"de nada",gr:"παρακαλώ"}
      ]},
      { id:"u2_nature", name:"Χώρες & Φύση", color:"#A8E6CF", unit:2, items:[
        {es:"Rusia",gr:"Ρωσία"},{es:"Grecia",gr:"Ελλάδα"},{es:"nieve",gr:"χιόνι"},{es:"al aire libre",gr:"σε εξωτερικό χώρο"},
        {es:"montaña",gr:"βουνό"},{es:"playa",gr:"παραλία"},{es:"mar",gr:"θάλασσα"}
      ]}
    ];

export const INITIAL_CATEGORIES: Category[] = [...UNIT1_CATEGORIES, ...UNIT2_CATEGORIES];
