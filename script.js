// ===== GLOBAL VARIABLES =====
let partyActive = false;
let chaosLevel = 0;
let flyingButtons = [];
let partyInterval;
let colorInterval;
let buttonsCount = 0;
let colorsCount = 0;
let currentLanguage = 'pl';

// ===== TRANSLATIONS =====
const translations = {
    pl: {
        // Loading
        "loading": "Ładowanie strony...",
        
        // Navigation
        "nav.home": "Strona Główna",
        "nav.dontClick": "NIE KLIKAJ!",
        "nav.games": "Moje Gry",
        "nav.social": "Social Media",
        "nav.setup": "Mój Setup",
        
        // Status
        "status.online": "Online",
        
        // Home
        "home.aboutMe": "O MNIE",
        "home.intro": "Cześć! Jestem Marcus, ale w internecie znany jestem jako <strong>Marek Narty</strong>. Mam 13 lat i od niedawna tworzę gry pod szyldem <strong>MNGame Studio</strong>.",
        "home.favoriteGames": "Moje ulubione gry:",
        "home.whatICreate": "Co tworzę:",
        "home.projectsIntro": "Obecnie pracuję nad dwoma projektami:",
        "home.fnufDesc": "horror inspirowany FNAF",
        "home.sandboxDesc": "sandbox inspirowany Garry's Mod",
        "home.motivation": "Gram w gry odkąd pamiętam, a teraz sam je tworzę. To moja pasja i chcę się nią dzielić!",
        "home.age": "13 lat",
        "home.country": "Polska",
        "home.developer": "Game Developer",
        
        // Games
        "games.title": "MOJE GRY",
        "games.subtitle": "Projekty nad którymi pracuję",
        "games.status.development": "W TRAKCIE ROZWOJU",
        "games.status.noAccess": "BRAK DOSTĘPU",
        
        "games.fnuf.description": "to horror survival inspirowany serią Five Nights at Freddy's.",
        "games.fnuf.feature1": "System kamer i monitoringu",
        "games.fnuf.feature2": "5 unikalnych animatroników",
        "games.fnuf.feature3": "System energii i zasilania",
        "games.fnuf.feature4": "Różne poziomy trudności",
        "games.fnuf.feature5": "Tryb minigier",
        
        "games.sandbox.description": "to gra sandbox inspirowana Garry's Mod. Twórz, eksploruj i baw się bez ograniczeń!",
        "games.sandbox.feature1": "Otwarty świat do eksploracji",
        "games.sandbox.feature2": "Narzędzia do budowania",
        "games.sandbox.feature3": "Fizyka Ragdoll",
        "games.sandbox.feature4": "Tryb wieloosobowy",
        "games.sandbox.feature5": "Własne skrypty i mody",
        
        "games.button.info": "Informacje",
        "games.button.play": "Przejdź do strony",
        "games.button.download": "Pobierz",
        
        // Modals
        "modal.description": "Opis gry",
        "modal.keyFeatures": "Kluczowe funkcje",
        "modal.technologies": "Technologie",
        "modal.warning": "Uwaga",
        
        "modal.fnuf.description": "FNUF to fanowski horror survival inspirowany kultową serią Five Nights at Freddy's. Wcielasz się w strażnika nocnego w kompleksie Ultimate Fear, gdzie musisz przetrwać do 6 rano, pilnując drzwi, oszczędzając energię i monitorując ruchy animatroników przez system kamer.",
        "modal.fnuf.feature1": "<strong>12 kamer</strong> do monitorowania całego kompleksu",
        "modal.fnuf.feature2": "<strong>5 unikalnych animatroników</strong> z różnymi wzorcami AI",
        "modal.fnuf.feature3": "<strong>System energii</strong> - zarządzaj zasilaniem",
        "modal.fnuf.feature4": "<strong>Różne noce</strong> o rosnącej trudności",
        "modal.fnuf.feature5": "<strong>Minigry</strong> i dodatkowe tryby",
        "modal.fnuf.feature6": "<strong>Pełne sterowanie klawiaturą</strong>",
        
        "modal.sandbox.description": "MN Sandbox to gra sandbox inspirowana Garry's Mod, która daje ci pełną swobodę tworzenia i eksploracji. Buduj niesamowite konstrukcje, eksperymentuj z fizyką, twórz własne skrypty i baw się z przyjaciółmi w trybie wieloosobowym.",
        "modal.sandbox.feature1": "<strong>Otwarty świat</strong> bez ograniczeń",
        "modal.sandbox.feature2": "<strong>Zaawansowane narzędzia budowania</strong>",
        "modal.sandbox.feature3": "<strong>Fizyka Ragdoll</strong> i przedmioty interaktywne",
        "modal.sandbox.feature4": "<strong>Tryb wieloosobowy</strong> (w planach)",
        "modal.sandbox.feature5": "<strong>System skryptów Lua</strong>",
        "modal.sandbox.feature6": "<strong>Wsparcie dla modów</strong>",
        "modal.sandbox.warning": "Gra jest w <strong>fazie wczesnego dostępu</strong>. Niektóre funkcje mogą nie działać poprawnie. Wszelkie błędy proszę zgłaszać na Discordzie.",
        
        "modal.button.play": "Zagraj w FNUF",
        "modal.button.download": "Pobierz MN Sandbox",
        
        // Social
        "social.title": "SOCIAL MEDIA",
        "social.subtitle": "Gdzie mnie znajdziesz",
        
        "social.discord.description": "Dołącz do społeczności, rozmawiaj o grach, zgłaszaj błędy",
        "social.youtube.description": "Gameplaye, poradniki, rozwój moich gier",
        "social.github.description": "Kod źródłowy moich projektów",
        "social.email.description": "Kontakt biznesowy i współpraca",
        "social.comingSoon.title": "Wkrótce więcej!",
        "social.comingSoon.description": "Nowe social media w przyszłości...",
        "social.comingSoon.link": "Stay tuned!",
        "social.more.title": "Więcej...",
        "social.more.description": "Nowe platformy wkrótce!",
        "social.more.link": "Coming soon",
        
        // Setup
        "setup.title": "MÓJ SETUP",
        "setup.subtitle": "Specyfikacja mojego sprzętu",
        "setup.specs.title": "Specyfikacja Techniczna",
        
        "setup.category.computer": "KOMPUTER",
        "setup.category.peripherals": "PERYFERIA",
        "setup.category.monitors": "MONITORY",
        "setup.category.software": "OPROGRAMOWANIE",
        
        "setup.specs.cpu": "Procesor:",
        "setup.specs.gpu": "Karta graficzna:",
        "setup.specs.ram": "Pamięć RAM:",
        "setup.specs.ssd": "Dysk systemowy:",
        "setup.specs.hdd": "Dysk danych:",
        "setup.specs.mouse": "Myszka:",
        "setup.specs.keyboard": "Klawiatura:",
        "setup.specs.headphones": "Słuchawki:",
        "setup.specs.mousepad": "Podkładka:",
        "setup.specs.mainMonitor": "Główny monitor:",
        "setup.specs.secondMonitor": "Drugi monitor:",
        "setup.specs.os": "System operacyjny:",
        "setup.specs.engine": "Silnik gier:",
        "setup.specs.ide": "IDE:",
        "setup.specs.graphics": "Grafika:",
        
        "setup.note.title": "Informacja:",
        "setup.note.text": "Ten setup pozwala mi komfortowo tworzyć gry i streamować. Unity 6000.2.7f2 to specjalna wersja edukacyjna, z której korzystam do rozwoju MN Sandbox.",
        
        "setup.performance.title": "Wydajność",
        "setup.performance.gaming": "Gaming:",
        "setup.performance.development": "Development:",
        "setup.performance.streaming": "Streaming:",
        
        // Party
        "party.title": "IMPREZA!",
        "party.subtitle": "MÓWIŁEM ŻEBY NIE KLIKAĆ!",
        "party.button.moreChaos": "WIĘCEJ CHAOSU!",
        "party.button.stop": "STOP IMPREZIE",
        "party.stats.buttons": "PRZYCISKÓW:",
        "party.stats.colors": "KOLORÓW:",
        "party.stats.chaos": "CHAOS LEVEL:",
        "party.instruction1": "Klikaj na przyciski!",
        "party.instruction2": "Przeciągaj je!",
        "party.instruction3": "Rotuj kółkiem myszy!",
        
        // Footer
        "footer.slogan": "Gry tworzone z pasji przez 13-letniego developera",
        "footer.quickLinks": "Szybkie linki",
        "footer.info": "Informacje",
        "footer.rights": "Wszystkie prawa zastrzeżone.",
        "footer.note": "Strona stworzona z ❤️ przez Marcusa"
    },
    
    en: {
        // Loading
        "loading": "Loading page...",
        
        // Navigation
        "nav.home": "Home",
        "nav.dontClick": "DON'T CLICK!",
        "nav.games": "My Games",
        "nav.social": "Social Media",
        "nav.setup": "My Setup",
        
        // Status
        "status.online": "Online",
        
        // Home
        "home.aboutMe": "ABOUT ME",
        "home.intro": "Hi! I'm Marcus, but online I'm known as <strong>Marek Narty</strong>. I'm 13 years old and I've recently started creating games under the banner of <strong>MNGame Studio</strong>.",
        "home.favoriteGames": "My favorite games:",
        "home.whatICreate": "What I create:",
        "home.projectsIntro": "Currently working on two projects:",
        "home.fnufDesc": "horror inspired by FNAF",
        "home.sandboxDesc": "sandbox inspired by Garry's Mod",
        "home.motivation": "I've been playing games for as long as I can remember, and now I'm creating them myself. It's my passion and I want to share it!",
        "home.age": "13 years",
        "home.country": "Poland",
        "home.developer": "Game Developer",
        
        // Games
        "games.title": "MY GAMES",
        "games.subtitle": "Projects I'm working on",
        "games.status.development": "IN DEVELOPMENT",
        "games.status.noAccess": "NO ACCESS",
        
        "games.fnuf.description": "is a survival horror game inspired by the Five Nights at Freddy's series.",
        "games.fnuf.feature1": "Camera and monitoring system",
        "games.fnuf.feature2": "5 unique animatronics",
        "games.fnuf.feature3": "Energy and power system",
        "games.fnuf.feature4": "Various difficulty levels",
        "games.fnuf.feature5": "Minigame mode",
        
        "games.sandbox.description": "is a sandbox game inspired by Garry's Mod. Create, explore and have fun without limits!",
        "games.sandbox.feature1": "Open world to explore",
        "games.sandbox.feature2": "Building tools",
        "games.sandbox.feature3": "Ragdoll physics",
        "games.sandbox.feature4": "Multiplayer mode",
        "games.sandbox.feature5": "Custom scripts and mods",
        
        "games.button.info": "Information",
        "games.button.play": "Go to page",
        "games.button.download": "Download",
        
        // Modals
        "modal.description": "Game description",
        "modal.keyFeatures": "Key features",
        "modal.technologies": "Technologies",
        "modal.warning": "Warning",
        
        "modal.fnuf.description": "FNUF is a fan-made survival horror game inspired by the iconic Five Nights at Freddy's series. You play as a night guard at the Ultimate Fear complex where you must survive until 6 AM by guarding doors, conserving power, and monitoring animatronic movements through the camera system.",
        "modal.fnuf.feature1": "<strong>12 cameras</strong> to monitor the entire complex",
        "modal.fnuf.feature2": "<strong>5 unique animatronics</strong> with different AI patterns",
        "modal.fnuf.feature3": "<strong>Power system</strong> - manage your energy",
        "modal.fnuf.feature4": "<strong>Different nights</strong> with increasing difficulty",
        "modal.fnuf.feature5": "<strong>Minigames</strong> and extra modes",
        "modal.fnuf.feature6": "<strong>Full keyboard control</strong>",
        
        "modal.sandbox.description": "MN Sandbox is a sandbox game inspired by Garry's Mod that gives you complete freedom to create and explore. Build amazing constructions, experiment with physics, create your own scripts, and have fun with friends in multiplayer mode.",
        "modal.sandbox.feature1": "<strong>Open world</strong> without limits",
        "modal.sandbox.feature2": "<strong>Advanced building tools</strong>",
        "modal.sandbox.feature3": "<strong>Ragdoll physics</strong> and interactive objects",
        "modal.sandbox.feature4": "<strong>Multiplayer mode</strong> (planned)",
        "modal.sandbox.feature5": "<strong>Lua scripting system</strong>",
        "modal.sandbox.feature6": "<strong>Mod support</strong>",
        "modal.sandbox.warning": "The game is in <strong>early access</strong>. Some features may not work properly. Please report any bugs on Discord.",
        
        "modal.button.play": "Play FNUF",
        "modal.button.download": "Download MN Sandbox",
        
        // Social
        "social.title": "SOCIAL MEDIA",
        "social.subtitle": "Where to find me",
        
        "social.discord.description": "Join the community, discuss games, report bugs",
        "social.youtube.description": "Gameplays, tutorials, development of my games",
        "social.github.description": "Source code of my projects",
        "social.email.description": "Business contact and collaboration",
        "social.comingSoon.title": "More coming soon!",
        "social.comingSoon.description": "New social media in the future...",
        "social.comingSoon.link": "Stay tuned!",
        "social.more.title": "More...",
        "social.more.description": "New platforms coming soon!",
        "social.more.link": "Coming soon",
        
        // Setup
        "setup.title": "MY SETUP",
        "setup.subtitle": "Specification of my equipment",
        "setup.specs.title": "Technical Specification",
        
        "setup.category.computer": "COMPUTER",
        "setup.category.peripherals": "PERIPHERALS",
        "setup.category.monitors": "MONITORS",
        "setup.category.software": "SOFTWARE",
        
        "setup.specs.cpu": "Processor:",
        "setup.specs.gpu": "Graphics card:",
        "setup.specs.ram": "RAM:",
        "setup.specs.ssd": "System drive:",
        "setup.specs.hdd": "Data drive:",
        "setup.specs.mouse": "Mouse:",
        "setup.specs.keyboard": "Keyboard:",
        "setup.specs.headphones": "Headphones:",
        "setup.specs.mousepad": "Mousepad:",
        "setup.specs.mainMonitor": "Main monitor:",
        "setup.specs.secondMonitor": "Second monitor:",
        "setup.specs.os": "Operating system:",
        "setup.specs.engine": "Game engine:",
        "setup.specs.ide": "IDE:",
        "setup.specs.graphics": "Graphics:",
        
        "setup.note.title": "Note:",
        "setup.note.text": "This setup allows me to comfortably create games and stream. Unity 6000.2.7f2 is a special educational version that I use for MN Sandbox development.",
        
        "setup.performance.title": "Performance",
        "setup.performance.gaming": "Gaming:",
        "setup.performance.development": "Development:",
        "setup.performance.streaming": "Streaming:",
        
        // Party
        "party.title": "PARTY!",
        "party.subtitle": "I TOLD YOU NOT TO CLICK!",
        "party.button.moreChaos": "MORE CHAOS!",
        "party.button.stop": "STOP PARTY",
        "party.stats.buttons": "BUTTONS:",
        "party.stats.colors": "COLORS:",
        "party.stats.chaos": "CHAOS LEVEL:",
        "party.instruction1": "Click on buttons!",
        "party.instruction2": "Drag them!",
        "party.instruction3": "Rotate with mouse wheel!",
        
        // Footer
        "footer.slogan": "Games created with passion by a 13-year-old developer",
        "footer.quickLinks": "Quick Links",
        "footer.info": "Information",
        "footer.rights": "All rights reserved.",
        "footer.note": "Site created with ❤️ by Marcus"
    },
    
    de: {
        // Loading
        "loading": "Seite wird geladen...",
        
        // Navigation
        "nav.home": "Startseite",
        "nav.dontClick": "NICHT KLICKEN!",
        "nav.games": "Meine Spiele",
        "nav.social": "Soziale Medien",
        "nav.setup": "Mein Setup",
        
        // Status
        "status.online": "Online",
        
        // Home
        "home.aboutMe": "ÜBER MICH",
        "home.intro": "Hallo! Ich bin Marcus, aber online bin ich als <strong>Marek Narty</strong> bekannt. Ich bin 13 Jahre alt und entwickle seit kurzem Spiele unter dem Banner von <strong>MNGame Studio</strong>.",
        "home.favoriteGames": "Meine Lieblingsspiele:",
        "home.whatICreate": "Was ich erstelle:",
        "home.projectsIntro": "Aktuell arbeite ich an zwei Projekten:",
        "home.fnufDesc": "Horror inspiriert von FNAF",
        "home.sandboxDesc": "Sandbox inspiriert von Garry's Mod",
        "home.motivation": "Ich spiele Spiele, solange ich denken kann, und jetzt erstelle ich sie selbst. Es ist meine Leidenschaft und ich möchte sie teilen!",
        "home.age": "13 Jahre",
        "home.country": "Polen",
        "home.developer": "Spieleentwickler",
        
        // Games
        "games.title": "MEINE SPIELE",
        "games.subtitle": "Projekte an denen ich arbeite",
        "games.status.development": "IN ENTWICKLUNG",
        "games.status.noAccess": "KEIN ZUGANG",
        
        "games.fnuf.description": "ist ein Survival-Horror-Spiel, inspiriert von der Five Nights at Freddy's Serie.",
        "games.fnuf.feature1": "Kamera- und Überwachungssystem",
        "games.fnuf.feature2": "5 einzigartige Animatronics",
        "games.fnuf.feature3": "Energie- und Stromsystem",
        "games.fnuf.feature4": "Verschiedene Schwierigkeitsgrade",
        "games.fnuf.feature5": "Minispiel-Modus",
        
        "games.sandbox.description": "ist ein Sandbox-Spiel, inspiriert von Garry's Mod. Erstelle, erkunde und habe Spaß ohne Grenzen!",
        "games.sandbox.feature1": "Offene Welt zum Erkunden",
        "games.sandbox.feature2": "Bauwerkzeuge",
        "games.sandbox.feature3": "Ragdoll-Physik",
        "games.sandbox.feature4": "Mehrspieler-Modus",
        "games.sandbox.feature5": "Eigene Skripte und Mods",
        
        "games.button.info": "Informationen",
        "games.button.play": "Zur Seite gehen",
        "games.button.download": "Herunterladen",
        
        // Modals
        "modal.description": "Spielbeschreibung",
        "modal.keyFeatures": "Hauptfunktionen",
        "modal.technologies": "Technologien",
        "modal.warning": "Warnung",
        
        "modal.fnuf.description": "FNUF ist ein von Fans erstelltes Survival-Horror-Spiel, inspiriert von der ikonischen Five Nights at Freddy's-Serie. Du spielst als Nachtwächter im Ultimate Fear-Komplex, wo du bis 6 Uhr morgens überleben musst, indem du Türen bewachst, Energie sparsam einsetzt und die Bewegungen der Animatronics durch das Kamerasystem überwachst.",
        "modal.fnuf.feature1": "<strong>12 Kameras</strong> zur Überwachung des gesamten Komplexes",
        "modal.fnuf.feature2": "<strong>5 einzigartige Animatronics</strong> mit verschiedenen KI-Mustern",
        "modal.fnuf.feature3": "<strong>Stromsystem</strong> - verwalte deine Energie",
        "modal.fnuf.feature4": "<strong>Verschiedene Nächte</strong> mit steigendem Schwierigkeitsgrad",
        "modal.fnuf.feature5": "<strong>Minispiele</strong> und zusätzliche Modi",
        "modal.fnuf.feature6": "<strong>Vollständige Tastatursteuerung</strong>",
        
        "modal.sandbox.description": "MN Sandbox ist ein Sandbox-Spiel, inspiriert von Garry's Mod, das dir vollständige Freiheit zum Erstellen und Erkunden gibt. Baue erstaunliche Konstruktionen, experimentiere mit Physik, erstelle eigene Skripte und habe Spaß mit Freunden im Mehrspieler-Modus.",
        "modal.sandbox.feature1": "<strong>Offene Welt</strong> ohne Grenzen",
        "modal.sandbox.feature2": "<strong>Fortgeschrittene Bauwerkzeuge</strong>",
        "modal.sandbox.feature3": "<strong>Ragdoll-Physik</strong> und interaktive Objekte",
        "modal.sandbox.feature4": "<strong>Mehrspieler-Modus</strong> (geplant)",
        "modal.sandbox.feature5": "<strong>Lua-Skriptsystem</strong>",
        "modal.sandbox.feature6": "<strong>Mod-Unterstützung</strong>",
        "modal.sandbox.warning": "Das Spiel befindet sich im <strong>frühen Zugriff</strong>. Einige Funktionen funktionieren möglicherweise nicht richtig. Bitte melde alle Fehler auf Discord.",
        
        "modal.button.play": "Spiele FNUF",
        "modal.button.download": "Lade MN Sandbox herunter",
        
        // Social
        "social.title": "SOZIALE MEDIEN",
        "social.subtitle": "Wo du mich findest",
        
        "social.discord.description": "Trete der Community bei, diskutiere über Spiele, melde Fehler",
        "social.youtube.description": "Gameplays, Tutorials, Entwicklung meiner Spiele",
        "social.github.description": "Quellcode meiner Projekte",
        "social.email.description": "Geschäftskontakt und Zusammenarbeit",
        "social.comingSoon.title": "Bald mehr!",
        "social.comingSoon.description": "Neue soziale Medien in Zukunft...",
        "social.comingSoon.link": "Bleib dran!",
        "social.more.title": "Mehr...",
        "social.more.description": "Neue Plattformen bald verfügbar!",
        "social.more.link": "Kommt bald",
        
        // Setup
        "setup.title": "MEIN SETUP",
        "setup.subtitle": "Spezifikation meiner Ausrüstung",
        "setup.specs.title": "Technische Spezifikation",
        
        "setup.category.computer": "COMPUTER",
        "setup.category.peripherals": "PERIPHERIE",
        "setup.category.monitors": "MONITORE",
        "setup.category.software": "SOFTWARE",
        
        "setup.specs.cpu": "Prozessor:",
        "setup.specs.gpu": "Grafikkarte:",
        "setup.specs.ram": "Arbeitsspeicher:",
        "setup.specs.ssd": "Systemlaufwerk:",
        "setup.specs.hdd": "Datenlaufwerk:",
        "setup.specs.mouse": "Maus:",
        "setup.specs.keyboard": "Tastatur:",
        "setup.specs.headphones": "Kopfhörer:",
        "setup.specs.mousepad": "Mauspad:",
        "setup.specs.mainMonitor": "Hauptmonitor:",
        "setup.specs.secondMonitor": "Zweiter Monitor:",
        "setup.specs.os": "Betriebssystem:",
        "setup.specs.engine": "Spiele-Engine:",
        "setup.specs.ide": "IDE:",
        "setup.specs.graphics": "Grafik:",
        
        "setup.note.title": "Hinweis:",
        "setup.note.text": "Dieses Setup ermöglicht es mir, bequem Spiele zu erstellen und zu streamen. Unity 6000.2.7f2 ist eine spezielle Bildungsversion, die ich für die Entwicklung von MN Sandbox verwende.",
        
        "setup.performance.title": "Leistung",
        "setup.performance.gaming": "Gaming:",
        "setup.performance.development": "Entwicklung:",
        "setup.performance.streaming": "Streaming:",
        
        // Party
        "party.title": "PARTY!",
        "party.subtitle": "ICH HABE DIR GESAGT NICHT ZU KLICKEN!",
        "party.button.moreChaos": "MEHR CHAOS!",
        "party.button.stop": "PARTY STOPPEN",
        "party.stats.buttons": "BUTTONS:",
        "party.stats.colors": "FARBEN:",
        "party.stats.chaos": "CHAOS LEVEL:",
        "party.instruction1": "Klicke auf Buttons!",
        "party.instruction2": "Ziehe sie!",
        "party.instruction3": "Rotiere mit Mausrad!",
        
        // Footer
        "footer.slogan": "Spiele mit Leidenschaft von einem 13-jährigen Entwickler erstellt",
        "footer.quickLinks": "Schnelllinks",
        "footer.info": "Informationen",
        "footer.rights": "Alle Rechte vorbehalten.",
        "footer.note": "Seite mit ❤️ von Marcus erstellt"
    },
    
    es: {
        // Loading
        "loading": "Cargando página...",
        
        // Navigation
        "nav.home": "Inicio",
        "nav.dontClick": "¡NO HAGA CLIC!",
        "nav.games": "Mis Juegos",
        "nav.social": "Redes Sociales",
        "nav.setup": "Mi Equipo",
        
        // Status
        "status.online": "En línea",
        
        // Home
        "home.aboutMe": "SOBRE MÍ",
        "home.intro": "¡Hola! Soy Marcus, pero en línea me conocen como <strong>Marek Narty</strong>. Tengo 13 años y recientemente comencé a crear juegos bajo el nombre de <strong>MNGame Studio</strong>.",
        "home.favoriteGames": "Mis juegos favoritos:",
        "home.whatICreate": "Lo que creo:",
        "home.projectsIntro": "Actualmente trabajo en dos proyectos:",
        "home.fnufDesc": "horror inspirado en FNAF",
        "home.sandboxDesc": "sandbox inspirado en Garry's Mod",
        "home.motivation": "Juego videojuegos desde que tengo memoria, ¡y ahora los creo yo mismo! Es mi pasión y quiero compartirla.",
        "home.age": "13 años",
        "home.country": "Polonia",
        "home.developer": "Desarrollador de Juegos",
        
        // Games
        "games.title": "MIS JUEGOS",
        "games.subtitle": "Proyectos en los que trabajo",
        "games.status.development": "EN DESARROLLO",
        "games.status.noAccess": "SIN ACCESO",
        
        "games.fnuf.description": "es un juego de terror y supervivencia inspirado en la serie Five Nights at Freddy's.",
        "games.fnuf.feature1": "Sistema de cámaras y monitoreo",
        "games.fnuf.feature2": "5 animatrónicos únicos",
        "games.fnuf.feature3": "Sistema de energía y potencia",
        "games.fnuf.feature4": "Diferentes niveles de dificultad",
        "games.fnuf.feature5": "Modo de minijuegos",
        
        "games.sandbox.description": "es un juego sandbox inspirado en Garry's Mod. ¡Crea, explora y diviértete sin límites!",
        "games.sandbox.feature1": "Mundo abierto para explorar",
        "games.sandbox.feature2": "Herramientas de construcción",
        "games.sandbox.feature3": "Física Ragdoll",
        "games.sandbox.feature4": "Modo multijugador",
        "games.sandbox.feature5": "Scripts y mods personalizados",
        
        "games.button.info": "Información",
        "games.button.play": "Ir a la página",
        "games.button.download": "Descargar",
        
        // Modals
        "modal.description": "Descripción del juego",
        "modal.keyFeatures": "Características principales",
        "modal.technologies": "Tecnologías",
        "modal.warning": "Advertencia",
        
        "modal.fnuf.description": "FNUF es un juego de terror y supervivencia creado por fans, inspirado en la icónica serie Five Nights at Freddy's. Juegas como guardia nocturno en el complejo Ultimate Fear, donde debes sobrevivir hasta las 6 AM vigilando puertas, conservando energía y monitoreando movimientos de animatrónicos a través del sistema de cámaras.",
        "modal.fnuf.feature1": "<strong>12 cámaras</strong> para monitorear todo el complejo",
        "modal.fnuf.feature2": "<strong>5 animatrónicos únicos</strong> con diferentes patrones de IA",
        "modal.fnuf.feature3": "<strong>Sistema de energía</strong> - administra tu energía",
        "modal.fnuf.feature4": "<strong>Diferentes noches</strong> con dificultad creciente",
        "modal.fnuf.feature5": "<strong>Minijuegos</strong> y modos adicionales",
        "modal.fnuf.feature6": "<strong>Control completo con teclado</strong>",
        
        "modal.sandbox.description": "MN Sandbox es un juego sandbox inspirado en Garry's Mod que te da libertad total para crear y explorar. Construye estructuras asombrosas, experimenta con física, crea tus propios scripts y diviértete con amigos en modo multijugador.",
        "modal.sandbox.feature1": "<strong>Mundo abierto</strong> sin límites",
        "modal.sandbox.feature2": "<strong>Herramientas de construcción avanzadas</strong>",
        "modal.sandbox.feature3": "<strong>Física Ragdoll</strong> y objetos interactivos",
        "modal.sandbox.feature4": "<strong>Modo multijugador</strong> (planeado)",
        "modal.sandbox.feature5": "<strong>Sistema de scripts Lua</strong>",
        "modal.sandbox.feature6": "<strong>Soporte para mods</strong>",
        "modal.sandbox.warning": "El juego está en <strong>acceso anticipado</strong>. Algunas funciones pueden no funcionar correctamente. Por favor, reporta cualquier error en Discord.",
        
        "modal.button.play": "Jugar FNUF",
        "modal.button.download": "Descargar MN Sandbox",
        
        // Social
        "social.title": "REDES SOCIALES",
        "social.subtitle": "Dónde encontrarme",
        
        "social.discord.description": "Únete a la comunidad, discute juegos, reporta errores",
        "social.youtube.description": "Gameplays, tutoriales, desarrollo de mis juegos",
        "social.github.description": "Código fuente de mis proyectos",
        "social.email.description": "Contacto comercial y colaboración",
        "social.comingSoon.title": "¡Próximamente más!",
        "social.comingSoon.description": "Nuevas redes sociales en el futuro...",
        "social.comingSoon.link": "¡Mantente atento!",
        "social.more.title": "Más...",
        "social.more.description": "¡Nuevas plataformas próximamente!",
        "social.more.link": "Próximamente",
        
        // Setup
        "setup.title": "MI EQUIPO",
        "setup.subtitle": "Especificación de mi equipo",
        "setup.specs.title": "Especificación Técnica",
        
        "setup.category.computer": "COMPUTADORA",
        "setup.category.peripherals": "PERIFÉRICOS",
        "setup.category.monitors": "MONITORES",
        "setup.category.software": "SOFTWARE",
        
        "setup.specs.cpu": "Procesador:",
        "setup.specs.gpu": "Tarjeta gráfica:",
        "setup.specs.ram": "Memoria RAM:",
        "setup.specs.ssd": "Disco del sistema:",
        "setup.specs.hdd": "Disco de datos:",
        "setup.specs.mouse": "Ratón:",
        "setup.specs.keyboard": "Teclado:",
        "setup.specs.headphones": "Auriculares:",
        "setup.specs.mousepad": "Alfombrilla:",
        "setup.specs.mainMonitor": "Monitor principal:",
        "setup.specs.secondMonitor": "Segundo monitor:",
        "setup.specs.os": "Sistema operativo:",
        "setup.specs.engine": "Motor de juego:",
        "setup.specs.ide": "IDE:",
        "setup.specs.graphics": "Gráficos:",
        
        "setup.note.title": "Nota:",
        "setup.note.text": "Este equipo me permite crear juegos y transmitir cómodamente. Unity 6000.2.7f2 es una versión educativa especial que uso para el desarrollo de MN Sandbox.",
        
        "setup.performance.title": "Rendimiento",
        "setup.performance.gaming": "Gaming:",
        "setup.performance.development": "Desarrollo:",
        "setup.performance.streaming": "Streaming:",
        
        // Party
        "party.title": "¡FIESTA!",
        "party.subtitle": "¡TE DIJE QUE NO HICIERAS CLIC!",
        "party.button.moreChaos": "¡MÁS CAOS!",
        "party.button.stop": "PARAR FIESTA",
        "party.stats.buttons": "BOTONES:",
        "party.stats.colors": "COLORES:",
        "party.stats.chaos": "NIVEL DE CAOS:",
        "party.instruction1": "¡Haz clic en los botones!",
        "party.instruction2": "¡Arrástralos!",
        "party.instruction3": "¡Rota con la rueda del ratón!",
        
        // Footer
        "footer.slogan": "Juegos creados con pasión por un desarrollador de 13 años",
        "footer.quickLinks": "Enlaces rápidos",
        "footer.info": "Información",
        "footer.rights": "Todos los derechos reservados.",
        "footer.note": "Sitio creado con ❤️ por Marcus"
    }
};

// ===== LANGUAGE FUNCTIONS =====
function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update UI elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = translations[lang][key];
            } else if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[lang][key]);
            } else if (element.hasAttribute('title')) {
                element.setAttribute('title', translations[lang][key]);
            } else {
                element.innerHTML = translations[lang][key];
            }
        }
    });
    
    // Update current language display
    const currentLangElement = document.querySelector('.current-language');
    if (currentLangElement) {
        currentLangElement.textContent = lang.toUpperCase();
    }
    
    // Update document language
    document.documentElement.lang = lang;
}

function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    dropdown.classList.toggle('show');
}

function closeLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    dropdown.classList.remove('show');
}

// ===== PAGE LOAD =====
window.addEventListener('DOMContentLoaded', function() {
    // Set initial language from localStorage or browser
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.substring(0, 2);
    
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    } else if (translations[browserLang]) {
        currentLanguage = browserLang;
    } else {
        currentLanguage = 'pl'; // Default to Polish
    }
    
    // Update language
    updateLanguage(currentLanguage);
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Setup event listeners
    setupEventListeners();
    
    // Show home page by default
    showPage('home');
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Language selector
    document.getElementById('language-toggle').addEventListener('click', toggleLanguageDropdown);
    
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            updateLanguage(lang);
            closeLanguageDropdown();
            playSound('click');
        });
    });
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const languageSelector = document.querySelector('.language-selector');
        if (!languageSelector.contains(event.target)) {
            closeLanguageDropdown();
        }
    });
    
    // Navigation buttons
    document.getElementById('home-btn').addEventListener('click', () => showPage('home'));
    document.getElementById('games-btn').addEventListener('click', () => showPage('games'));
    document.getElementById('social-btn').addEventListener('click', () => showPage('social'));
    document.getElementById('setup-btn').addEventListener('click', () => showPage('setup'));
    
    // Don't Click button - starts the party!
    document.getElementById('dont-click-btn').addEventListener('click', startParty);
    
    // Party controls
    document.getElementById('more-chaos-btn').addEventListener('click', addMoreChaos);
    document.getElementById('stop-party-btn').addEventListener('click', stopParty);
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Copy email on click
    document.querySelector('.social-card.email').addEventListener('click', copyEmail);
}

// ===== PAGE NAVIGATION =====
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const pageElement = document.getElementById(pageName + '-page');
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // Close language dropdown
    closeLanguageDropdown();
    
    // Play click sound
    playSound('click');
}

// ===== GAME INFO MODALS =====
function showGameInfo(game) {
    const modal = document.getElementById(game + '-info-modal');
    if (modal) {
        modal.style.display = 'flex';
        playSound('click');
    }
}

function closeModal(game) {
    const modal = document.getElementById(game + '-info-modal');
    if (modal) {
        modal.style.display = 'none';
        playSound('click');
    }
}

// ===== PARTY SYSTEM (Don't Click!) =====
function startParty() {
    if (partyActive) return;
    
    partyActive = true;
    chaosLevel = 1;
    buttonsCount = 0;
    colorsCount = 0;
    
    // Show party screen
    const partyScreen = document.getElementById('party-screen');
    partyScreen.classList.remove('party-hidden');
    
    // Start party music
    const partySound = document.getElementById('party-sound');
    partySound.volume = 0.3;
    partySound.currentTime = 0;
    partySound.play();
    
    // Start chaos intervals
    partyInterval = setInterval(addFlyingButton, 500);
    colorInterval = setInterval(changeColors, 1000);
    
    // Initial buttons
    for (let i = 0; i < 10; i++) {
        setTimeout(() => addFlyingButton(), i * 100);
    }
    
    // Update stats
    updatePartyStats();
    
    // Make buttons draggable
    makeButtonsDraggable();
    
    // Add mouse wheel rotation
    document.addEventListener('wheel', rotateButtons);
}

function stopParty() {
    if (!partyActive) return;
    
    partyActive = false;
    
    // Hide party screen
    const partyScreen = document.getElementById('party-screen');
    partyScreen.classList.add('party-hidden');
    
    // Stop intervals
    clearInterval(partyInterval);
    clearInterval(colorInterval);
    
    // Stop music
    const partySound = document.getElementById('party-sound');
    partySound.pause();
    
    // Remove all flying buttons
    const container = document.getElementById('flying-buttons-container');
    container.innerHTML = '';
    flyingButtons = [];
    
    // Reset chaos
    chaosLevel = 0;
    updatePartyStats();
    
    playSound('click');
}

function addMoreChaos() {
    if (!partyActive) return;
    
    chaosLevel++;
    if (chaosLevel > 10) chaosLevel = 10;
    
    // Add more buttons
    for (let i = 0; i < 5; i++) {
        addFlyingButton();
    }
    
    // Speed up intervals
    clearInterval(partyInterval);
    clearInterval(colorInterval);
    
    const speed = Math.max(100, 1000 - (chaosLevel * 80));
    partyInterval = setInterval(addFlyingButton, speed);
    colorInterval = setInterval(changeColors, Math.max(200, 1000 - (chaosLevel * 90)));
    
    updatePartyStats();
    playSound('click');
}

function addFlyingButton() {
    if (!partyActive) return;
    
    const container = document.getElementById('flying-buttons-container');
    if (!container) return;
    
    // Create button
    const button = document.createElement('button');
    button.className = 'flying-button';
    
    // Random properties
    const texts = [
        "NIE KLIKAJ!", "IMPREZA!", "CHAOS!", "🎉", "🎊", 
        "MÓWIŁEM!", "STOP!", "WIĘCEJ!", "HULAJ!", "TAŃCZ!",
        "KOLORY!", "DŹWIĘK!", "MIGAJ!", "KRĘĆ!", "LATAJ!"
    ];
    
    const colors = [
        '#ff0064', '#ff3300', '#ffaa00', '#ffff00', '#00ff88',
        '#00aaff', '#0088ff', '#8800ff', '#ff00ff', '#ffffff'
    ];
    
    const text = texts[Math.floor(Math.random() * texts.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Style button
    button.textContent = text;
    button.style.color = color;
    button.style.background = bgColor;
    button.style.border = `3px solid ${color}`;
    button.style.fontSize = `${14 + Math.random() * 10}px`;
    button.style.boxShadow = `0 0 ${10 + chaosLevel * 5}px ${color}`;
    
    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // Random rotation
    const rotation = Math.random() * 360;
    
    // CSS variables for animation
    button.style.setProperty('--tx', `${x}px`);
    button.style.setProperty('--ty', `${y}px`);
    button.style.setProperty('--tr', `${rotation}deg`);
    
    // Animation
    button.style.animation = `buttonFly 0.5s ease-out forwards, buttonFloat 3s infinite ease-in-out`;
    
    // Click event - makes it more chaotic
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Change color
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        this.style.color = newColor;
        this.style.borderColor = newColor;
        this.style.boxShadow = `0 0 ${20 + chaosLevel * 5}px ${newColor}`;
        
        // Play sound
        playSound('click');
        
        // Small explosion effect
        createExplosion(e.clientX, e.clientY, newColor);
        
        // Increment counters
        buttonsCount++;
        colorsCount++;
        updatePartyStats();
    });
    
    // Add to container
    container.appendChild(button);
    flyingButtons.push(button);
    
    // Update stats
    buttonsCount++;
    updatePartyStats();
}

function changeColors() {
    if (!partyActive) return;
    
    // Change colors of all buttons
    const colors = [
        '#ff0064', '#ff3300', '#ffaa00', '#ffff00', '#00ff88',
        '#00aaff', '#0088ff', '#8800ff', '#ff00ff', '#ffffff'
    ];
    
    flyingButtons.forEach(button => {
        if (Math.random() > 0.7) { // 30% chance to change each button
            const color = colors[Math.floor(Math.random() * colors.length)];
            const bgColor = colors[Math.floor(Math.random() * colors.length)];
            
            button.style.color = color;
            button.style.background = bgColor;
            button.style.borderColor = color;
            button.style.boxShadow = `0 0 ${10 + chaosLevel * 5}px ${color}`;
            
            colorsCount++;
        }
    });
    
    // Change party title color
    const partyTitle = document.querySelector('.party-text');
    if (partyTitle) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        partyTitle.style.background = `linear-gradient(45deg, ${color}, ${colors[Math.floor(Math.random() * colors.length)]})`;
        partyTitle.style.webkitBackgroundClip = 'text';
        partyTitle.style.webkitTextFillColor = 'transparent';
    }
    
    updatePartyStats();
}

function createExplosion(x, y, color) {
    const container = document.getElementById('flying-buttons-container');
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        container.appendChild(particle);
        animate();
    }
}

function makeButtonsDraggable() {
    let isDragging = false;
    let dragButton = null;
    let offsetX = 0;
    let offsetY = 0;
    
    document.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('flying-button')) {
            isDragging = true;
            dragButton = e.target;
            
            const rect = dragButton.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            dragButton.style.cursor = 'grabbing';
            dragButton.style.zIndex = '1000';
            
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging && dragButton) {
            dragButton.style.position = 'fixed';
            dragButton.style.left = (e.clientX - offsetX) + 'px';
            dragButton.style.top = (e.clientY - offsetY) + 'px';
            dragButton.style.animation = 'none';
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging && dragButton) {
            isDragging = false;
            dragButton.style.cursor = 'pointer';
            dragButton.style.zIndex = '1';
            
            // Restart float animation
            dragButton.style.animation = `buttonFloat 3s infinite ease-in-out`;
            
            dragButton = null;
        }
    });
}

function rotateButtons(e) {
    if (!partyActive) return;
    
    const delta = Math.sign(e.deltaY);
    flyingButtons.forEach(button => {
        const currentRotation = parseFloat(button.style.getPropertyValue('--tr') || 0);
        const newRotation = currentRotation + (delta * 10);
        button.style.setProperty('--tr', `${newRotation}deg`);
    });
}

function updatePartyStats() {
    document.getElementById('button-count').textContent = buttonsCount;
    document.getElementById('color-count').textContent = colorsCount;
    document.getElementById('chaos-level').textContent = chaosLevel;
}

// ===== SOCIAL MEDIA =====
function copyEmail() {
    const email = 'mareknartymngame@gmail.com';
    
    // Create temporary input
    const tempInput = document.createElement('input');
    tempInput.value = email;
    document.body.appendChild(tempInput);
    
    // Select and copy
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    
    // Remove temporary input
    document.body.removeChild(tempInput);
    
    // Visual feedback
    const emailCard = document.querySelector('.social-card.email');
    const originalColor = emailCard.style.borderColor;
    
    emailCard.style.borderColor = '#00ff88';
    emailCard.style.boxShadow = '0 0 20px #00ff88';
    
    setTimeout(() => {
        emailCard.style.borderColor = originalColor;
        emailCard.style.boxShadow = 'none';
    }, 1000);
    
    // Alert
    const alertMessage = translations[currentLanguage] ? 
        translations[currentLanguage]["email_copied"] || `Email copied to clipboard: ${email}` : 
        `Email copied to clipboard: ${email}`;
    alert(alertMessage);
    playSound('click');
}

// ===== AUDIO =====
function playSound(type) {
    let sound;
    
    if (type === 'click') {
        sound = document.getElementById('click-sound');
    } else if (type === 'party') {
        sound = document.getElementById('party-sound');
    }
    
    if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.3;
        sound.play().catch(e => console.log("Audio play failed:", e));
    }
}

// ===== UTILITY FUNCTIONS =====
function playBackgroundMusic() {
    // Optional background music
    // You can add this if you want
}

// Make sure party stops when leaving page
window.addEventListener('beforeunload', function() {
    if (partyActive) {
        stopParty();
    }
});

// Handle window resize for party buttons
window.addEventListener('resize', function() {
    if (partyActive) {
        // Reposition buttons if needed
        flyingButtons.forEach(button => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            button.style.setProperty('--tx', `${x}px`);
            button.style.setProperty('--ty', `${y}px`);
        });
    }
});

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Add tooltips to social media cards
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach(card => {
        if (!card.classList.contains('coming-soon')) {
            card.title = translations[currentLanguage] ? 
                translations[currentLanguage]["social.click_to_visit"] || 'Click to visit' : 
                'Click to visit';
        }
    });
});

// Add translations for missing keys
translations.pl["email_copied"] = "Email skopiowany do schowka: ";
translations.en["email_copied"] = "Email copied to clipboard: ";
translations.de["email_copied"] = "E-Mail in die Zwischenablage kopiert: ";
translations.es["email_copied"] = "Correo electrónico copiado al portapapeles: ";

translations.pl["social.click_to_visit"] = "Kliknij aby przejść";
translations.en["social.click_to_visit"] = "Click to visit";
translations.de["social.click_to_visit"] = "Klicken zum Besuchen";
translations.es["social.click_to_visit"] = "Haz clic para visitar";
