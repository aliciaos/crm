
var models = require('../models');
var Sequelize = require('sequelize');



exports.seed = function(req, res, next) {

	Sequelize.Promise.all(
		[
			{ 	code: "A", 
				title: "Perfil Hormonal",
				DTResults: [
					{ 	code: "1", 
						title: "Estrogénico débil", 
						description: "Débil ínfluencia estrógenica.",
						DTROptions: [
						]
					},
					{ 	code: "2", 
						title: "Estrogénico medio", 
						description: "Frotis estrogénico con buen trofismo." ,
						DTROptions: [
						]
					},
					{ 	code: "3", 
						title: "Estrogénico alto", 
						description: "Predominio celular superficial,con abundantes células picnoticas. Compatibilidad con una alta influencia estrogenica." ,
						DTROptions: [
						]
					},
					{ 	code: "4", 
						title: "Luteinico débil", 
						description: "Discreta agrupación y algún plegamiento celular.(I.Pleg.+). Compatibilidad con una ínfluencia luteinica débil.",
						DTROptions: [
						] 
					},
					{ 	code: "6", 
						title: "Luteinico marcado", 
						description: "Células agrupadas y abundantes plegamientos.(I.Pleg.+++). Compatibilidad con marcada influencia luteinica.",
						DTROptions: [
						] 
					},
					{ 	code: "7", 
						title: "Gestación", 
						description: "Agrupación celular y plegamientos marcados (naviculares). (Compatibilidad con gestación).",
						DTROptions: [
						] 
					},
					{ 	code: "8", 
						title: "Atrófico débil", 
						description: "Presencia de células parabasales compatible con un hipotrofismo.",
						DTROptions: [
						] 
					},
					{ 	code: "9", 
						title: "Atrófico moderado", 
						description: "Abundantes células parabasales. Discreta autolisis con presencia de núcleos líbres. (Compatible con una atrofia moderada).",
						DTROptions: [
						] 
					},
					{ 	code: "11", 
						title: "Concordancia", 
						description: "Concordancia de la lectura hormonal con los datos menstruales.",
						DTROptions: [
						] 
					},
					{ 	code: "12", 
						title: "Discordancia", 
						description: "Discordancia de la lectura hormonal con los datos menstruales.",
						DTROptions: [
						] 
					},
					{ 	code: "13", 
						title: "Influencia hormonal adecuada", 
						description: "Influencia hormonal adecuada.",
						DTROptions: [
						] 
					},
					{ 	code: "14", 
						title: "Infl.hormonal discordante", 
						description: "Influencia hormonal discordante con la historia de la paciente.",
						DTROptions: [
						] 
					},
					{ 	code: "20", 
						title: "Opción líbre", 
						description: "",
						DTROptions: [
						] 
					},
					{ 	code: "17", 
						title: "Intermedio", 
						description: "Predominio célular de típo intermedio.(Frotis estratrófico)." ,
						DTROptions: [
						]
					},
					{ 	code: "18", 
						title: "1ª fase", 
						description: "Abúndantes células superficiales pícnoticas sobre un fondo límpio. Imágen cito-hormonal compatible con la prímera fase del ciclo.",
						DTROptions: [
						]
					},
					{ 	code: "19", 
						title: "2ª fase", 
						description: "Agrupamiento celular y plegamiento marcado. Imágen cito-hormonal compatible con la segunda fase del ciclo.",
						DTROptions: [
						] 
					},
					{ 	code: "15", 
						title: "no valorable", 
						description: "" ,
						DTROptions: [
							{ code: "A", title: "ínflamación.", description: "No valorable por incidencia de carácter ínflamatorio." },
							{ code: "B", title: "citolisis", description: "Marcada lisis celular compatible con hipoestronismo." },               
							{ code: "C", title: "Hematico.", description: "No valorable por tratarse de un extendido marcadamente hemático." } 
						]
					},
					{ 	code: "10", 
						title: "atrófico+++", 
						description: "" ,
						DTROptions: [
							{ code: "A", title: "Atrófico marcado", description: "Predominio de células pavimentosas cohesionadas y parabasales. (Compatibilidad con atrofia marcada). I.M. 94.6.0" },
							{ code: "B", title: "Alta atrofia.", description: "Extendido altamente atrófico con células profundas, placas de cohesión y núcleos libres. I.M. 100.0.0" },
							{ code: "C", title: "atrófico marcado,sin I.M.", description: "Predominio de células parabasales.(Extendido atrófico)." }
						]
					},
					{ 	code: "16", 
						title: "atrófico puerperal", 
						description: "",
						DTROptions: [
							{ code: "A", title: "puerperio", description: "Presencia de células parabasales ovales, con refuerzo del borde. Compatible con atrofia puerperal." },
							{ code: "B", title: "Lactancia", description: "Células postnatales con refuerzo citoplasmático. Compatible con lactancia." }
						] 
					},
					{ 	code: "5", 
						title: "luteinico medio", 
						description: "",
						DTROptions: [
							{ code: "A", title: "lueinico moderado", description: "Agrupaciones y plegamientos celulares.(I. Pleg.++). Compatible con ínfluencia luteinica moderada." },
							{ code: "B", title: "luteinico inespecifico", description: "Agrupaciones y plegamientos celulares que ofrecen una ímagen de ínfluencia luteinica." }
						] 
					}
				]
		    },
			{ 	code: "B", 
				title: "Microbiologia",
				DTResults: [
					{ 	code: "1", 
						title: "Lactobacilos", 
						description: "" ,
						DTROptions: [
							{ code: "A", title: "Döderlein (no abundantes).", description: "Bacilos de Döderlein no abundantes.(I.Estimativo:1)." },               
							{ code: "B", title: "B.de Döderlein.(+)", description: "Bacilos de Döderlein.(I.Estimativo:2)." },                             
							{ code: "C", title: "B.deDöderlein.(+++).", description: "Abundantes bacilos de Döderlein y citolisis. (I.Estimativo 3)." },     
							{ code: "D", title: "B.de Döderlein(+++)y citolisis.", description: "Abundantes bacilos de Döderlein con marcada citolísis." },             
							{ code: "E", title: "B.de Döderlein(++++).", description: "Abundantes lactobacilos.(I.Estimativo:4). Disbacteriosis vaginal, posible etiología de sígnos ó síntomas irritativos." }
						]
					},
					{ 	code: "2", 
						title: "Leptotrix", 
						description: "" ,
						DTROptions: [
							{ code: "A", title: "Leptotrix(++).", description: "Presencia de Leptotrix vaginalis.(I.Estimativo:2)." },                 
							{ code: "B", title: "Leptotrix (+++).", description: "Abundantes bacterias del G. leptotrix vaginalis líbres y agrupadas." }
						]
					},
					{ 	code: "3", 
						title: "Trichomonas", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Trichomonas (+)", description: "Infestación por protozoos del G.Trichonomas vaginalis." },             
							{ code: "B", title: "Trichomonas (+++)", description: "Abundantes protozoos del G. Trichonomas vaginalis." },                 
							{ code: "C", title: "Trichomonas y Gardenerellas.", description: "Asociacion de Trichomonas y gardenerellas vaginalis." }              
						] 
					},
					{ 	code: "4", 
						title: "Gardenerellas", 
						description: "",
						DTROptions: [
							{ code: "C", title: "Gardnerellas spp.", description: "Microorganismos morfologicamente incluidos en Gardenerellas spp." },   
							{ code: "A", title: "Gardenerellas.(+).", description: "Gardenerellas vaginalis spp." },                                       
							{ code: "B", title: "Gardenerellas.(++)", description: "  Gardenerellas spp.en fondo con presencia de células guías." }      
						] 
					},
					{ 	code: "5", 
						title: "Cocos", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Cocos.", description: "Flora cocácea inespecifica en fondo. (I.Estimativo:2)." },             
							{ code: "B", title: "Cocos(+++).", description: "bundante flora cocácea inespecífica.(I. Estimativo:3)." },            
							{ code: "C", title: "Estreptococos.", description: "Presencia de cocos agrupados en cadenas.(Estreptococos)." },           
							{ code: "D", title: "Estafilococos.", description: "Presencia de cocos agrupados en rácimos.(Estafilococos)." },         
							{ code: "E", title: "Diplococos.", description: "resencia de cocos lanceolados.(Diplococos)." },                       
							{ code: "F", title: "Diplococos (intracél.)", description: "Diplococos intracelulares.Abundantes piocitos. (Sugerimos cultivo)." }
						] 
					},
					{ 	code: "6", 
						title: "Hongos", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Cándidas.(+)", description: "Hifas en redes y aisladas de Cándidas spp." },                         
							{ code: "B", title: "Cándidas(+++).", description: "Abundantes hifas de Candidas spp. en redes y aisladas." },             
							{ code: "C", title: "Cándidas y esporos.", description: "ifas de Cándidas albicans y formas esporuladas." },                   
							{ code: "E", title: "Esporos(++)", description: "Marcada presencia de esporos de hongos líbres y en acúmulos." },       
							{ code: "F", title: "Torulopsis.", description: "Presencia de hongos del G.Torulopsis." },                              
							{ code: "H", title: "no hongos", description: "No se observan formaciones fungoides." },                                
							{ code: "D", title: "Esporos (+).", description: "Algunos esporos de hongos líbres y agrupados." }                   
						] 
					},
					{ 	code: "7", 
						title: "Actinomicetos", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Actinomices.", description: "Presencia irregular de acúmulos bacilares de Actinomyces Israeli." }
						] 
					},
					{ 	code: "8", 
						title: "Opción líbre.", 
						description: "" ,
						DTROptions: [
						]
					},
					{ 	code: "9", 
						title: "Flora mixta", 
						description: "",
						DTROptions: [
							{ code: "A", title: "flora mixta.(+).", description: "Lacto y cocobacilos.(Flora mixta)." },                                 
							{ code: "B", title: "flora mixta(+++)", description: "Lactobacilos y abundante flora mixta inespecifica." }                
						] 
					},
					{ 	code: "10", 
						title: "flora no patógena",
						description: "",
						DTROptions: [
							{ code: "A", title: "No flora", description: "Aparente ausencia de flora vaginal." },                                
							{ code: "B", title: "no gérmenes", description: "No observamos gérmenes patógenos." }                                 
						] 
					}
				]
			},
			{ 	code: "C", 
				title: "Citomorfología",
				DTResults: [
					{ 	code: "1", 
						title: "Normalidad", 
						description: "" ,
						DTROptions: [
							{ code: "A", title: "Coordenadas benignas.", description: "Criterios morfológicos para ambas coordenadas celulares en parámetros benignos." },
							{ code: "B", title: "Criterios benignos.", description: "Morfología celular dentro de criterios de benignidad." },              
							{ code: "C", title: "Ausencia de malignidad.", description: "No se evidencian signos morfológicos de malignidad." },                
							{ code: "D", title: "C. benigna.", description: "Células mostrando citoplasmas de bordes nítidos,estructura homo genea y núcleos con relación N/C equilibrada." },
							{ code: "H", title: "No endometriales.", description: "Caracteristicas morfologicas benignas. Ausencia de células endometriales." },
							{ code: "G", title: "Atipia indeterminada.", description: "Presencia de atipias morfologicas de significación indeterminada." },  
							{ code: "F", title: "Endocervicales (+++) 2", description: "Abundante descamación de células endocervicales. Conjunto morfologico benigno." },
							{ code: "E", title: "Endocervicales(+++) 1", description: "Abundantes células endocervicales en placas y líbres. Carácteres morfologicos benignos." }
						]
					},
					{ 	code: "2", 
						title: "Inflamación", 
						description: "" ,
						DTROptions: [
							{ code: "F", title: "Cervicitis.", description: "Alteraciones morfológicas de origen inflamatorio en células procedentes de cervix.(Cervicitis)." },
							{ code: "G", title: "Fondo hemático.", description: "Fondo hemático con abundantes hematies bien conservados." },           
							{ code: "H", title: "Leucocitos(+++).", description: "Marcada infiltración leucocitaria.(PMN)." },                           
							{ code: "I", title: "Colpitis Atrófica.", description: "Placas atróficas y núcleos libres. Autolisis. Compatibilidad con: Vaginitis atrófica." },
							{ code: "J", title: "No ínflamación.", description: "Ausencia de reacción ínflamatoria." },                                 
							{ code: "K", title: "Leucocitos +++ (cérvix)", description: "Abundantes leucocitos en tomas de cérvix." },                          
							{ code: "L", title: "hematíes +++ (cérvix)", description: "Fondo hematico en tomas de cérvix." },                                 
							{ code: "M", title: "Atipias inflamación.", description: "Cambios celulares reactivos, asociados a inflamación. (Atipias de predominio inflamatorio)." },
							{ code: "E", title: "No valorable.", description: "Extendido no satisfactorio para una correcta evaluación hormonal y morfologica,debido al componente flogistico." },
							{ code: "D", title: "Histiocitos (+++).", description: "Abundantes histiocitos líbres y formando complejos." },                
							{ code: "C", title: " Histiocitos.", description: "Presencia de histiocitos." },                                          
							{ code: "B", title: "Hematies.", description: "Hematíes bien conservados." },                                         
							{ code: "A", title: "Leucocitos (++).", description: "Infiltración leucocitaria." }
						]
					},
					{ 	code: "3", 
						title: "Metaplasia", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Metaplasia inmadura.", description: "Células metaplasicas inmaduras con estructura cromatica uniforme." },  
							{ code: "B", title: "Metaplasia con anisonucleosis.", description: "Células metaplasicas con anisonucleosis e hipercromasia." },           
							{ code: "C", title: "Metaplasia ínmadura con anisonucleosis.", description: "Células metaplasicas inmaduras , con discreta anisonucleosis." },      
							{ code: "E", title: "Metaplasia madura.", description: "Metaplasia madura del epitelio de revestimiento endocervical." },      
							{ code: "F", title: "Metaplasia abundante.", description: "Marcada descamación de células metaplasicas de carácter ínmaduro y en maduración." },
							{ code: "D", title: "Metaplasia normal(Madura).", description: "Células metaplasicas en placas y aisladas con límites precisos." }
						] 
					},
					{ 	code: "4", 
						title: "Reparación", 
						description: "" ,
						DTROptions: [
							{ code: "B", title: "Reparación", description: "Presencia de células reparativas en placas. Cromatina regular." },     
							{ code: "A", title: "Reparación atipica", description: "Grupos de reparación, con relación N/C alterada." }                   
						]
					},
					{ 	code: "5", 
						title: "Disqueratosis", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Hiperqueratosis.", description: "Escamas anucleadas.(Hiperqueratosis)." },                              
							{ code: "B", title: "Paraqueratosis.", description: "Células queratinizadas con núcleos pícnoticos. (Paraqueratosis)." },   
							{ code: "C", title: "Hiperqueratosis +++", description: "Intensa descamación de células queratinizadas líbres y en placas." }  
						] 
					},
					{ 	code: "6", 
						title: "NIC I", 
						description: "",
						DTROptions: [
							{ code: "C", title: "NIC I (pocas)", description: "Presencia de escasas células procedentes de una NIC I." },             
							{ code: "B", title: "N.I.C. I", description: "Células pavimentosas con discreta hipertrofia e irregularidad nuclear, compatible con una NIC I.(Lesión intrapavimentosa de bajo grado)." },
							{ code: "A", title: "NIC I", description: "Células de epitelio escamoso de capas altas con alteraciones madurativas compatibles con Lesión intrapavimentosa de bajo grado. (N.I.C. I)." }
						] 
					},
					{ 	code: "7", 
						title: "NIC II", 
						description: "",
						DTROptions: [
							{ code: "A", title: "N.I.C.II", description: "Células epiteliales intermedias y parabasales con alteraciones madurativas y de la diferenciación, compatible con NIC II." },
							{ code: "B", title: "N.I.C. II", description: "  Pleomorfismo nuclear e hipercromasia en células parabasales e intermedias compatibles con una Lesión intrapavimentosa de alto grado. (CIN II)." }
						] 
					},
					{ 	code: "8", 
						title: "NIC III", 
						description: "" ,
						DTROptions: [
							{ code: "B", title: "N.I.C.III", description: "Células profundas de probable origen metaplasico con alteración N/C, irregularidad nuclear e hipercromasia, compatible con una NIC III." },
							{ code: "A", title: "N.I.C.III", description: "Marcadas alteraciones de diferenciación con hipercromasia en núcleos voluminosos que muestran acúmulos de cromatina toscamente distribuida. Compatible con displasia severa (NIC III)." },
							{ code: "C", title: "N.I.C.III", description: "Grupos celulares de tipo sincitial con citoplasmas largos, núcleos irregulares con membrana engrosada .Acúmulos de cromatina groseros. Compatible con una NIC III." },
							{ code: "L", title: "líbre", description: "" }
						]
					},
					{ 	code: "9", 
						title: "C.I.S", 
						description: "",
						DTROptions: [
							{ code: "A", title: "C.I.S. (1).", description: "Células profundas con marcada alteración nucleocitoplasmatica, irregularidades nucleares, hipercromasia en algunos núcleos y acúmulos de cromatina en otros . Fondo limpio. Compatibilidad con un C.in situ." },
							{ code: "B", title: "C.I.S.(2)", description: "Células ovales en hileras con núcleos voluminosos e hipercromaticos Cromatina tosca y membrana nuclear gruesa. La extensión es compatible con un C.I.S." }
						]
					},
					{ 	code: "10", 
						title: "Ca. escamoso", 
						description: "",
						DTROptions: [
							{ code: "B", title: "Ca. escamoso(2).", description: "Acentuado pleomorfismo nuclear con núcleos grandes e hipercroma ticos. Células queratinizadas fusiformes. Carcinoma escamoso invasor." },
							{ code: "A", title: "Ca. escamoso.(1).", description: "Se observan grupos densos con núcleos hipercromaticos, mostrando cromatina distribuida en gruesos acúmulos. Marcada anisonucleosis." },
							{ code: "C", title: "Ca.escamoso(3).", description: "Fondo sucio. Celularidad en complejos irregulares con pérdida de orientación y superposición. Algunos núcleos fusiformes con hipercromasia y cromatina toscamente granular." }
						] 
					},
					{ 	code: "15", 
						title: "Aspiración hiperplasia displasia II", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Hiperplasia Displasica II.", description: "CITOLOGIA ENDOMETRIAL. Fondo hemático. Abundantes grupos endometriales con núcleos hipercromaticos e irregulares. Cromatina aumentada e irregular. Núcleolos diseminados. Presencia de micronucleol" },
							{ code: "C", title: "Hiperplasia displásica II", description: "CITOLOGIA ENDOMETRIAL. Presencia de placas celulares desordenadas con núcleos aumentados de tamaño y desiguales, así como una distribución cromática irre gular." },
							{ code: "B", title: "H.Displasica II", description: "CITOLOGIA ENDOMETRIAL. Fondo hemático y núcleos sueltos. Descamación marcada en conglomerados celulares. Anisocariosis e hipercromasia. Cromatina irregular. Presencia de algunos macronucléolos." }
						] 
					},
					{ 	code: "16", 
						title: "(H.S.V) Herpesvirus", 
						description: "Células multinucleadas con amoldamiento nuclear (imágen en cristal esmerilado) e inclusiones intranucleares. Vacuolizaciones en los citoplasmas. Herpesvirus simple 2 (H.S.V.)." ,
						DTROptions: [

						]
					},
					{ 	code: "17", 
						title: "H.P.V (condiloma)", 
						description: "",
						DTROptions: [
							{ code: "B", title: "H:P:V. II", description: "Anomalías nucleares (binucleaciones y discromia) Presencia de algunos coilocitos. Compatibilidad con H.P.V." },
							{ code: "A", title: "H.P.V. I", description: "Núcleos hipertróficos con formaciones degenerativas y halos peri-nucleares. Algunos citoplasmas se muestran velados. Compatibilidad con virosis de Papilomavirus huma" },
							{ code: "C", title: "H.P.V. III", description: "Núcleos hipertróficos con halos perinucleares.Presencia de coilo citos y algunas binucleaciones. Compatible con afección de PVH (Papilomavirus humano)." }
						] 
					},
					{ 	code: "13", 
						title: "Aspiración endometrial normal.", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Aspiración normal (1).", description: "CITOLOGIA ENDOMETRIAL. Fondo hemático con presencia de células endometriales en placas y líbres,así como algunas del estroma con isomorfismo y núcleos con buena distribución cromatica.(Extendido normal)." },
							{ code: "B", title: "Aspiración normal (2).", description: "CITOLOGIA ENDOMETRIAL. Fondo hematico, con presencia de grupos de células endometriales de caracteristicas nucleares dentro de la normalidad." }
						] 
					},
					{ 	code: "14", 
						title: "Asp.Displasica I (Hiperplasia símple).", 
						description: "",
						DTROptions: [
							{ code: "B", title: "Hiperplasia Displasica I", description: "CITOLOGIA ENDOMETRIAL. Placas de células bien cohesionadas y ordenadas. Los núcleos se encuentran discretamente aumentados y con hipercro cromasia." },
							{ code: "A", title: "Hiperplasia displasica I(a).", description: "CITOLOGIA ENDOMETRIAL. Sobre un fondo hematico,se observan grupos endometriales con superposición celular,díscreta discariosis e hipercromasia,mostrando una distribución cromatica regular y citoplasma poco" }
						] 
					},
					{ 	code: "20", 
						title: "Opción líbre", 
						description: "" ,
						DTROptions: [

						]
					},
					{ 	code: "11", 
						title: "L.I.P.(alto grado)", 
						description: "" ,
						DTROptions: [
							{ code: "A", title: "L.I.P. (Alto Grado).", description: "Células pavimentosas con marcada alteración núcleo-citoplasmatica,irregularidades nucleares e hipercromatismo. Compatibilidad con una lesión intrapavimentosa de alto grado." }
						]
					},
					{ 	code: "12", 
						title: "Adenocarcinoma endocervical", 
						description: "",
						DTROptions: [
							{ code: "A", title: "adeno cervix", description: "Células endocervicales con anisonucleosis e hipercromasia marcada. Los límites celulares son poco nítidos. Compatibilidad con Adenocarcinoma de cérvix." }
						] 
					},
					{ 	code: "18", 
						title: "Adenocarcinoma", 
						description: "",
						DTROptions: [
							{ code: "A", title: "Adca.", description: "" },
							{ code: "B", title: "Op.líbre", description: "" }
						] 
					}
				]
			},
			{ 	code: "D", 
				title: "Sugerencia",
				DTResults: [
					{	code: "1",
						title: "Sug. Informe Colpocitologico",
						description: "",
						DTROptions: [
							{ code: "A", title: "Control anual.", description: "Control periodico anual." },                                           
							{ code: "B", title: "C.periodico.", description: "Control regularmente." },                                              
							{ code: "C", title: "C.a críterio clínico.", description: "Control a criterio clínico." },                                        
							{ code: "D", title: "Citologia semestral", description: "Efectuar nuevo estudio citológico a los seís meses." },                
							{ code: "E", title: "C.trimestral.", description: "Mantener el control clínico y nuevo estudio citológico a los tres meses." },
							{ code: "F", title: "C.mensual.", description: "Control citológico dentro de un mes, aproximadamente." },              
							{ code: "G", title: "C.post-tratamiento.", description: "Control citológico después del tratamiento." },                        
							{ code: "H", title: "C.histologico.", description: "Verificación histológica." },                                          
							{ code: "I", title: "Legrado.", description: "Legrado intracavitario." },                                            
							{ code: "J", title: "Legrado fracionado.", description: "Legrado fraccionado para verificación histológica." },                 
							{ code: "K", title: "Biopsia.", description: "Atendiendo a las atipias halladas, aconsejamos, efectuar biopsia para valoración histologica." },
							{ code: "L", title: "Conización.", description: "Conización como verificación histológica y tratamiento." },            
							{ code: "O", title: "Opción líbre.", description: "" },
							{ code: "M", title: "Por antecedentes:semestral.", description: "Dados los antecedentes,aconsejamos controles clínico y citologico semestrales." },
							{ code: "P", title: "ginecologo.", description: "Debe consultar a su ginecologo." }                                 
						]
					}
				]
			}
		]
	) 
	.each(function(dtype) {

		return models.DType.create(	dtype,
							        { include: [ { model: models.DTResult,
							                       include: [ { model: models.DTROption } ]
							                     }
							                   ]
							        }
							      );
    })
	.then(function() {
	 	console.log('Seeder: Creados todos los códigos de diagnósticos.');
	 	res.redirect('/dtypes');
	})
	.catch(function(error) { 
		console.log("Error:", error);
		next(error);
	});	

};





