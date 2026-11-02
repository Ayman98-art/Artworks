// بيانات اللوحات (32 لوحة)
const arts = [
  { title:"الموناليزا", artist:"ليوناردو دافنشي", year:1503, era:"عصر النهضة", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/600px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg", desc:"لوحة تتحدى الزمن. الابتسامة الغامضة والطبيعة الخلفية غير المكتملة يخلقان إحساسًا بأن اللوحة حية وتتغير أمام عينيك. دافنشي استخدم تقنية السفوماتو ليصنع ملامح لا تبدو صلبة، لتعبر عن الغموض البشري والتوتر بين الروح والطبيعة." },
  { title:"ميلاد فينوس", artist:"بوتيتشيلي", year:1485, era:"عصر النهضة", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/800px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg", desc:"تخيل الجمال الإلهي وهو يخرج من البحر. اللوحة بتمثل النقاء والطبيعة، ورياح الربيع بتدفع فينوس ناحية الشاطئ. بوتيتشيلي هنا مش بيرسم واقع، هو بيرسم أسطورة شاعرية بتعبر عن الجمال المثالي والروحانية اللي عصر النهضة كان بيدور عليها." },
  { title:"العشاء الأخير", artist:"ليوناردو دافنشي", year:1498, era:"عصر النهضة", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg/800px-The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg", desc:"اللوحة مش عن الأكل، هي لحظة الصدمة! المسيح لسه بيقول واحد فيكم هيسلمني، وكل التلاميذ في حالة ذهول وصدمة. دافنشي رتب الـ 12 شخص في 3 مجموعات عشان يحكي قصة الخيانة والوفاء في ثانية واحدة." },
  { title:"خلق آدم", artist:"مايكل أنجلو", year:1512, era:"عصر النهضة", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/800px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg", desc:"نقطة التلامس بين إصبع الله وإصبع آدم هي سر الحياة. آدم بيبان خامل ومسترخي، ربنا بيبعت له الطاقة. اللوحة بتعبر عن لحظة بداية الحياة، والفجوة الصغيرة بين الإصبعين خلقت توتر خالد بيجذب العين." },
  { title:"مدرسة أثينا", artist:"رافائيل", year:1511, era:"عصر النهضة", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/800px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg", desc:"حلم عصر النهضة في لوحة واحدة. كل فلاسفة وعلماء اليونان اتجمعوا في قاعة واحدة (أفلاطون وأرسطو في النص). رافائيل هنا بيحتفل بالعقل البشري والبحث عن الحقيقة، وكأنه بيقول إن العلم والفكر بيتكملوا مع بعض." },
  { title:"حديقة الملذات الأرضية", artist:"هيرونيموس بوش", year:1510, era:"عصر النهضة", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg/800px-The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg", desc:"رحلة سريالية بين الجنة (يسار)، الملذات (وسط)، والجحيم (يمين). اللوحة مليانة تفاصيل غريبة وكائنات خرافية. بوش كان بيحذر البشر من الانغماس في الشهوات، واللوحة بتبان كأنها كابوس مرئي عن مصير الإنسان." },
  { title:"برج بابل", artist:"بيتر بروغل", year:1563, era:"عصر النهضة", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg/800px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg", desc:"البرج بيرمز للغرور البشري. البشر بيحاولوا يبنوا حاجة توصل للسما بجهدهم، لكن البناء مهزوز ومش مكتمل. اللوحة بتعبر عن فشل الطموح البشري لما بيبقى بعيد عن الحكمة، وبتشبه المدن الحديثة المزدحمة اللي بتدور على المستحيل." },
  { title:"الدورية الليلية", artist:"رامبرانت", year:1642, era:"الباروك", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/The_Night_Watch_-_HD.jpg/800px-The_Night_Watch_-_HD.jpg", desc:"رامبرانت كسر قاعدة رسم الشخصيات، ورسم الحركة. الضوء واقع على القبطان ومساعده، والباقي في ظل. اللوحة بتحسسك إن فيه حدث لسه بيحصل، مش مجرد صورة. بتعبر عن الانتماء والحركة في ظل ظلام دامس." },
  { title:"وصيفات الشرف", artist:"دييغو فيلاسكيز", year:1656, era:"الباروك", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Las_Meninas_01.jpg/800px-Las_Meninas_01.jpg", desc:"اللوحة دي عبارة عن ألغاز! الرسام راسم نفسه وهو بيرسم، والطفلة (الملكة الصغيرة) بتتفرج. الملك والملكة بيبانوا في المرايا في الخلف. اللوحة بتسأل: مين اللي بيتم رسمه؟ مين اللي بيراقب؟ بتعبر عن تعقيد الواقع وفكرة الصورة داخل الصورة." },
  { title:"الفتاة ذات القرط اللؤلؤي", artist:"يوهانس فيرمير", year:1665, era:"الباروك", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meisje_met_de_parel.jpg/600px-Meisje_met_de_parel.jpg", desc:"بيسموها موناليزا الشمال. فيرمير ركز على الضوء اللي واقع على وشها والقرط. اللحظة اللي هي بتلف فيها لورا وتفرج علينا بحياء وسرية. بتعبر عن البساطة، الجمال الهادي، والغموض اللي في نظرة العين." },
  { title:"الحرية تقود الشعب", artist:"أوجين ديلاكروا", year:1830, era:"الرومانسية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/800px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg", desc:"الست اللي في النص هي رمز الحرية، بتقود الشعب فوق الجثث والدمار. اللوحة بتحكي عن ثورة 1830 في فرنسا. بتعبر عن التضحية، الشجاعة، والأمل في بكرة أحسن مهما كان الحاضر صعب." },
  { title:"طوف الميدوزا", artist:"تيودور جيريكو", year:1819, era:"الرومانسية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/JEAN_LOUIS_TH%C3%89ODORE_G%C3%89RICAULT_-_La_Balsa_de_la_Medusa_%28Museo_del_Louvre%2C_1818-19%29.jpg/800px-JEAN_LOUIS_TH%C3%89ODORE_G%C3%89RICAULT_-_La_Balsa_de_la_Medusa_%28Museo_del_Louvre%2C_1818-19%29.jpg", desc:"قصة حقيقية لسفينة غرقت والتخلي عن الركاب. اللوحة بترسم لحظة الصراع بين الأمل (بيحاولوا يلوحوا لسفينة إنقاذ) واليأس والموت. بتعبر عن هشاشة الإنسان وقسوة الطبيعة، وبتعكس فساد المسؤولين اللي سابوا الشعب يموت." },
  { title:"المتجول فوق بحر الضباب", artist:"كاسبار ديفيد فريدريش", year:1818, era:"الرومانسية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpeg/600px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpeg", desc:"راجل واقف لوحده بيتأمل في بحر من الضباب. اللوحة مش عن الشخص، دي عن الإحساس. بتعبر عن عظمة الطبيعة أمام ضعف الإنسان، والتأمل، والوحدة. من أشهر لوحات الرومانسية اللي بتحسسك بالفناء وأنت بتتفرج." },
  { title:"الثالث من مايو 1808", artist:"فرانسيسكو جويا", year:1814, era:"الرومانسية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/El_tres_de_mayo_de_1808_en_Madrid%2C_por_Francisco_de_Goya_%28Museo_del_Prado%29.jpg/800px-El_tres_de_mayo_de_1808_en_Madrid%2C_por_Francisco_de_Goya_%28Museo_del_Prado%29.jpg", desc:"جويا هنا بيرسم جرح في التاريخ. الجيش الفرنسي بيعمل إعدامات لمدنيين إسبان. الراجل اللي لابس أبيض ورافع إيديه، والدم اللي على الأرض. بتعبر عن فظاعة الحرب ووجهها القبيح، ومفيش مجد هنا، فيه موت بس." },
  { title:"الموجة العظيمة", artist:"هوكوساي", year:1831, era:"أوكييو-إي", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Tsunami_by_hokusai_19th_century.jpg/800px-Tsunami_by_hokusai_19th_century.jpg", desc:"الموجة عالية كأنها وحش هيهجم على القوارب. جبل فوجي واقف في الخلف بثبات. اللوحة بتعبر عن التوازن بين قوة الطبيعة المدمرة وهدوء الجبل. بتعكس فلسفة يابانية عن الاحترام للطبيعة والخوف منها في نفس الوقت." },
  { title:"أوفيليا", artist:"جون إيفريت ميليه", year:1852, era:"ما قبل رافائيل", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/John_Everett_Millais_-_Ophelia_-_Google_Art_Project.jpg/800px-John_Everett_Millais_-_Ophelia_-_Google_Art_Project.jpg", desc:"مشهد غرق أوفيليا من مسرحيات شكسبير. هي بتموت وسط الزهور والزينة، وبتغني. اللوحة بتحول الموت لمشهد جمال شاعري. بتعبر عن الجنون، الحب المرفوض، والنهاية الهادية الحزينة، مع تفاصيل رهيبة لكل زهرة." },
  { title:"والدة ويستلر", artist:"جيمس ويستلر", year:1871, era:"الواقعية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Whistlers_Mother_high_res.jpg/600px-Whistlers_Mother_high_res.jpg", desc:"لوحة بسيطة جدًا لست كبيرة بتقعد على كرسي في غرفة هادية. ويستلر قال عنها ترتيب في الرمادي والأسود. مش عن الشخص، دي عن الهارموني والشكل. بتعبر عن الهدوء، الرزانة، والشعور بالأمان اللي بيديه الحضن." },
  { title:"انطباع، شروق الشمس", artist:"كلود مونيه", year:1872, era:"الانطباعية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Claude_Monet%2C_Impression%2C_soleil_levant.jpg/800px-Claude_Monet%2C_Impression%2C_soleil_levant.jpg", desc:"شمس برتقالية بتشرق على ميناء ضبابي. مفيش تفاصيل دقيقة، مفيش خطوط واضحة، كله ضربات فرشاة سريعة. اللوحة دي هي اللي بدأت حركة الانطباعية، وبتعبر عن اللحظة العابرة والإحساس السريع بالضوء والجو." },
  { title:"صف الحصة", artist:"إدغار ديجا", year:1874, era:"الانطباعية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg/800px-Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg", desc:"ديجا كان بيحب يرسم الحركة. فتيات الباليه مش بيستعرضوا، بالعكس ده هما مرهقين ومستنيين إشارة المعلم. اللوحة بتعبر عن الكواليس، التعب، الانضباط، والجهد اللي ورا الجمال، مع زوايا غريبة ومبتكرة." },
  { title:"غداء على متن قارب", artist:"بيير أوغوست رينوار", year:1881, era:"الانطباعية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Pierre-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg/800px-Pierre-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg", desc:"أصدقاء بيتغدوا على شرفة مطلة على النهر. الشمس بتدخل من بين الشجر وتعمل دوائر ضوء على هدومهم. رينوار بيرسم السعادة، البهجة، والاسترخاء في يوم صيفي. بتعبر عن فرحة الحياة البسيطة." },
  { title:"أحد على جزيرة لا غراند جات", artist:"جورج سورا", year:1884, era:"التنقيطية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/800px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg", desc:"آلاف النقاط الصغيرة اتجمعت عشان ترسم باريسيين بيرتاحوا في حديقة. اللوحة بتعبر عن الهدوء والصرامة في نفس الوقت. بتشبه مشهد سينمائي مجمد. فيها طبقات اجتماعية مختلفة بتقف مع بعض في هدوء غريب." },
  { title:"الليلة المرصعة بالنجوم", artist:"فان جوخ", year:1889, era:"ما بعد الانطباعية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg", desc:"فان جوخ رسمها من مصحة الأمراض النفسية. السما بتلف وتدور كأنها موج بحر. الشجرة السوداء (السرو) بتوصل الأرض بالسما. بتعبر عن العاصفة الداخلية والاضطراب النفسي، مع رغبة في السلام الروحي، رغم إن القرية تحت هادية جدًا." },
  { title:"مقهى ليلي", artist:"فان جوخ", year:1888, era:"ما بعد الانطباعية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Vincent_van_Gogh_-_Caf%C3%A9_Terrace_at_Night_%28Place_du_Forum%2C_Arles%29_-_Google_Art_Project.jpg/800px-Vincent_van_Gogh_-_Caf%C3%A9_Terrace_at_Night_%28Place_du_Forum%2C_Arles%29_-_Google_Art_Project.jpg", desc:"مقهى بلون أصفر قوي وسط ليل أزرق عميق. النجوم بتلمع في السما. فان جوخ كان عايز يبين إن الليل أكثر حيوية وألوان من النهار. اللوحة بتعبر عن الأمل، الدفء، الرغبة في التواصل، وسط العتمة." },
  { title:"الصرخة", artist:"إدفارد مونك", year:1893, era:"التعبيرية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/600px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg", desc:"في الحقيقة، الشخص ده مش هو اللي بيصرخ، هو بيغطي ودانه من صرخة الطبيعة. السما حمراء (زي ثورة بركان)، والإنسان بيتلوي من الرعب. بتعبر عن القلق الوجودي، الذعر، والاكتئاب اللي بيحس بيه الإنسان في عالم مليان فوضى." },
  { title:"القُبلة", artist:"جوستاف كليمت", year:1908, era:"الفن الجديد", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Art_Project.jpg/800px-The_Kiss_-_Gustav_Klimt_-_Google_Art_Project.jpg", desc:"راجل وست بيدوبوا في بعض وسط أشكال ذهبية مزركشة. الست بتستسلم للحظة، والراجل محاوطها. اللوحة بتعبر عن الحب كحالة من الاندماج الكامل، الأمان، والانفصال عن العالم. الذهب هنا بيرمز للروحانية والقدسية." },
  { title:"ثبات الذاكرة", artist:"سلفادور دالي", year:1931, era:"السريالية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/The_Persistence_of_Memory.jpg/800px-The_Persistence_of_Memory.jpg", desc:"ساعات بتدوب وتسيح على الشجر والطاولة. دالي هنا بيهاجم فكرة الزمن الثابت. بتعبر عن إن الوقت مش حاجة صلبة، هو إحساس. في الأحلام، والذكريات، الزمن بيمتد وبيتغير. اللوحة بتسأل: إيه هو الوقت الحقيقي؟" },
  { title:"غيرنيكا", artist:"بابلو بيكاسو", year:1937, era:"التكعيبية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/PicassoGuernica.jpg/800px-PicassoGuernica.jpg", desc:"رد فعل على قصف مدينة غيرنيكا في إسبانيا. الوجوه مقطعة، الأجساد مشوهة، الثور بيصرخ، الأم شايلة ولدها الميت. مفيش ألوان، أبيض وأسود بس (زي الجرايد). بتعبر عن فظاعة الحرب، العذاب، وكيف إن المدنيين هما اللي بيدفعوا التمن." },
  { title:"الفريدتان", artist:"فريدا كاهلو", year:1939, era:"السريالية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Frida_Kahlo_%28self_portrait%2C_The_Two_Fridas%29.jpg/600px-Frida_Kahlo_%28self_portrait%2C_The_Two_Fridas%29.jpg", desc:"فريدا بترسم نفسها مرتين: واحدة بلبس أوروبي وواحدة بلبس مكسيكي. القلبين مكشوفين ومربوطين بشرايين. اللوحة بتعبر عن الانقسام الداخلي، الهوية، والألم الجسدي والنفسي اللي كانت بتعاني منه بعد حادثة وحياتها مع دييجو ريفيرا." },
  { title:"صقور الليل", artist:"إدوارد هوبر", year:1942, era:"الواقعية الأمريكية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Nighthawks_by_Edward_Hopper_1942.jpg/800px-Nighthawks_by_Edward_Hopper_1942.jpg", desc:"4 أشخاص في كافيتريا مضيئة وسط مدينة فاضية في الليل. كلهن قاعدين قريبين من بعض، بس مفيش كلام ولا تواصل. اللوحة بتعبر عن العزلة، الوحدة، والاغتراب في المدينة الحديثة (خصوصاً في زمن الحرب العالمية التانية)." },
  { title:"قوطية أمريكية", artist:"جرانت وود", year:1930, era:"الواقعية الأمريكية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/600px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg", desc:"راجل ماسك شوكة (رمز العمل)، وست جنبه، واقفين قدام بيت خشبي بشباك على شكل قوس. وشوشهم جدية وجامدة. اللوحة بقت أيقونة للريف الأمريكي، لكنها بتحمل سخرية خفية من الحياة الزراعية القاسية والمحافظة." },
  { title:"ابن الإنسان", artist:"رينيه ماغريت", year:1964, era:"السريالية", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Ren%C3%A9_Magritte_-_The_Son_of_Man.jpg/600px-Ren%C3%A9_Magritte_-_The_Son_of_Man.jpg", desc:"راجل بلبس رسمي، لكن وشه مغطي بتفاحة! ماغريت بيلعب على فكرة إخفاء المألوف. بتعبر عن إننا دايماً بنشوف بس جزء من الحقيقة، وإن دايماً في حاجة مخفية ورا اللي إحنا شايفينه. إحساس بالغموض والخداع البصري." },
  { title:"علب حساء كامبل", artist:"آندي وارهول", year:1962, era:"بوب آرت", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Campbell%27s_Soup_Cans%2C_1962.jpg/800px-Campbell%27s_Soup_Cans%2C_1962.jpg", desc:"32 علبة حساء متراصة. وارهول هنا مش بيرسم فن تقليدي، هو بيرسم الاستهلاك. اللوحة بتعبر عن ثقافة الاستهلاك الجماعي في أمريكا، والتكرار اللي بيشبه حياتنا اليومية. بيسأل: إيه اللي بيخلي الحاجة العادية تبقى فنية؟" }
];

let currentEra = 'all';
let currentArtist = 'all';
const gallery = document.getElementById('gallery');

// دالة بتجيب الصورة عن طريق بروكسي عشان تتخطى حظر الشبكة
function getProxiedImage(url) {
    // بنستخدم بروكسي قوي جداً بيسمح بجلب الصور
    return `https://api.codetabs.com/v1/proxy?quest=${url}`;
}

function renderGallery() {
    let html = '';
    let count = 0;
    
    for (let i = 0; i < arts.length; i++) {
        let art = arts[i];
        if ((currentEra === 'all' || art.era === currentEra) && (currentArtist === 'all' || art.artist === currentArtist)) {
            count++;
            let proxiedImg = getProxiedImage(art.img);
            // لو الصورة فشلت حتى مع البروكسي، بيحط صورة فنية بديلة
            let fallbackImg = "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=400&auto=format&fit=crop";
            
            html += '<div class="card" onclick="openModal(' + i + ')">';
            html += '<img src="' + proxiedImg + '" alt="' + art.title + '" onerror="this.src=\'' + fallbackImg + '\'">';
            html += '<div class="card-info">';
            html += '<h3 class="card-title">' + art.title + '</h3>';
            html += '<p class="card-artist">' + art.artist + ' · ' + art.year + '</p>';
            html += '</div></div>';
        }
    }
    
    if (count === 0) {
        html = '<p style="text-align:center; width:100%; color:#6fa9c2; grid-column: 1/-1;">لا توجد لوحات مطابقة</p>';
    }
    gallery.innerHTML = html;
    document.getElementById('counter').innerText = 'عرض ' + count + ' لوحة';
}

function filterCards(type, value, btn) {
    if (type === 'era') currentEra = value;
    if (type === 'artist') currentArtist = value;

    let parent = btn.parentNode;
    let buttons = parent.getElementsByClassName('chip');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    btn.classList.add('active');

    renderGallery();
}

function openModal(index) {
    let art = arts[index];
    let proxiedImg = getProxiedImage(art.img);
    let fallbackImg = "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop";

    let mImg = document.getElementById('mImg');
    mImg.src = proxiedImg;
    mImg.onerror = function() { this.src = fallbackImg; };

    document.getElementById('mTitle').innerText = art.title;
    document.getElementById('mArtist').innerText = art.artist + ' · ' + art.year + ' · ' + art.era;
    document.getElementById('mDesc').innerText = art.desc;
    
    document.getElementById('modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('open');
    document.body.style.overflow = 'auto';
}

window.addEventListener('scroll', function() {
    let btn = document.getElementById('scrollTop');
    if (window.scrollY > 300) {
        btn.style.display = 'flex';
    } else {
        btn.style.display = 'none';
    }
});

// تشغيل عند التحميل
document.addEventListener("DOMContentLoaded", function() {
    renderGallery();
});
