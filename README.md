# Endamál
At gera ein Node API servara, ið veitir yvirlit yvir kommunur, vegir, bygdir og bústadir í Føroyum í JSON

#Innihaldsyvirlit
1. [Uppsetan](https://github.com/signarit/adressur/blob/master/README.md#uppsetan)
2. [Endaknútar](https://github.com/signarit/adressur/blob/master/README.md#endaknútar-endpoints)
  1. [Umsiting](https://github.com/signarit/adressur/blob/master/README.md#umsiting)
  2. [Kommunur](https://github.com/signarit/adressur/blob/master/README.md#kommunur)
  3. [Postnummur](https://github.com/signarit/adressur/blob/master/README.md#postnummur)
  4. [Vegir](https://github.com/signarit/adressur/blob/master/README.md#vegir)
3. [Veikleikar og betringar](https://github.com/signarit/adressur/blob/master/README.md#veikleikar-og-betringar)

##Uppsetan
* Byrja við at gera tær ein MySQL-databasa. Eg havi brúkt navnið *addresses*, men tú kanst velja, hvussu databasin skal eita. Minst bara til at skriva rætta databasunavnið, tá tú bindur í databasuservaran. Eitt SQL-script til uppsetan av tabellunum er í rótini og fílurin eitur [sql.sql](https://github.com/signarit/adressur/blob/master/sql.sql)

* Rætta linjurnar \#63-67 í [server.js](https://github.com/signarit/adressur/blob/master/server.js) og áset adressuna til databasuservaran, brúkaranavn, loyniorð og navn á databasuni, sum tú júst hevur stovnað. Soleiðis síggja linjurnar út:
```
var mysql = mysql.createConnection({
	host: 'localhost',
	user: 'username',
	password: 'password',
	database: 'addresses',
	charset: 'utf8mb4'
});
```
* Koyr ```npm install``` fyri at installera allar dependencies

* Far inn á [http://localhost:3000/admin](http://localhost:3000/admin) og uploada fílarnar, ið liggja í [public/upload](https://github.com/signarit/adressur/tree/master/public/upload). Fílarnir eru hesir:

| Fílnavn | Frágreiðing | Leinkja |
--- | --- | ---
adr.txt | Hevur allar bústaðir í Føroyum | [adr.txt] (https://github.com/signarit/adressur/blob/master/public/upload/adr.txt)
kommunur.txt | Hevur allar kommunur í Føroyum | [kommunur.txt] (https://github.com/signarit/adressur/blob/master/public/upload/kommunur.txt)
postnr.txt | Hevur øll postnummur í Føroyum | [postnr.txt] (https://github.com/signarit/adressur/blob/master/public/upload/postnr.txt)
veg.txt | Hevur allar vegir í Føroyum | [veg.txt] (https://github.com/signarit/adressur/blob/master/public/upload/veg.txt)

* Tá fílarnir verða uploadaðir, fáa teir nýtt navn, sum hevur formin YYYY_MM_DD_\<fílnavn\>. Hetta er tí, at tað altíð skal vera møguligt at síggja gomlu fílarnar og sortera teir eftir dagfesting. Fílarnir verða lagdir í public/upload. Tá ein fílur verður uploadaður, verður hann lisin og goymdur í databasanum.

* Nú kanst tú t.d. vitja [http://localhost:3000/kommunur](http://localhost:3000/kommunur)

##Endaknútar (endpoints)
###Umsiting
Endaknútar viðvíkjandi umsiting av bústøðum

| Lýsing | Háttur | Endaknútur
---|---|---
| Umsiting av síðuni | GET | /admin
| Uploading av fílum | POST | /upload

###Kommunur
Endaknútar viðvíkjandi kommunum

| Lýsing | Háttur | Endaknútur
---|---|---
| Allar kommunur | GET | /kommunur
| Ávís kommuna | GET | /kommuna/**_id_**
| Ávís kommuna við bygdum | GET | /kommuna/**_id_**/bygdir
| Ávís kommuna við vegnum | GET | /kommuna/**_id_**/vegir
| Ávís kommuna við bústøðum | GET | /kommuna/**_id_**/bustadir

Dømi: ```http://localhost:3000/kommuna/5```. Úrslit:
```
[
  {
    id: 5,
    municipality_id: 6,
    name: "Kunoyar"
  }
]
```

###Postnummur
Endaknútar viðvíkjandi postnummurum

| Lýsing | Háttur | Endaknútur
---|---|---
| Øll postnummur | GET | /postnummur
| Øll postnummur við kommunum | GET | /postnummur/kommunur
| Ávíst postnummar | GET | /postnummar/**_id_**
| Ávíst postnummar við kommunu | GET | /postnummar/**_id_**/kommuna
| Ávíst postnummar við vegum | GET | /postnummar/**_id_**/vegir
| Ávíst postnummar við bústøðum | GET | /postnummar/**_id_**/bustadir

Dømi: ```http://intranet.app:3000/postnummar/796/vegir```. Úrslit:
```
[
  {
    id: 1769,
    road_id: 3294,
    municipality_id: 5,
    zip_code_id: 796,
    name: "Bakkavegur",
    x: 215725.2,
    y: 906581.6
  },
  {
    id: 1770,
    road_id: 3295,
    municipality_id: 5,
    zip_code_id: 796,
    name: "Kalsoyarvegur",
    x: 215768.52,
    y: 906516.96
  },
  {
    id: 1773,
    road_id: 3298,
    municipality_id: 5,
    zip_code_id: 796,
    name: "Heimigarður",
    x: 215800.59,
    y: 906384.63
  },
  {
    id: 1774,
    road_id: 3299,
    municipality_id: 5,
    zip_code_id: 796,
    name: "Norðurgarður",
    x: 215701.63,
    y: 906612.72
  }
]
```

###Bygdir
Endaknútar viðvíkjandi bygdum

| Lýsing | Háttur | Endaknútur
---|---|---
| Allar bygdir | GET | /bygdir
| Allar bygdir við kommunum | GET | /bygdir/kommunur
| Ávís bygd | GET | /bygd/**_id_**
| Ávís bygd við vegum | GET | /bygd/**_id_**/vegir
| Ávís bygd við bústøðum | GET | /bygd/**_id_**/bustadir

Dømi: ```http://intranet.app:3000/bygd/96```. Úrslit:
```
[
  {
    id: 96,
    zip_code: 767,
    municipality_id: 1,
    name: "Hattarvík"
  }
]
```

###Vegir
Endaknútar viðvíkjandi vegum

| Lýsing | Háttur | Endaknútur
---|---|---
| Allir vegir | GET | /vegir
| Ávísur vegur | GET | /vegur/**_id_**
| Ávísur vegur við bústøðum | GET | /vegur/**_id_**/bustadir

Dømi: ```http://intranet.app:3000/vegur/2```. Úrslit:
```
[
  {
    id: 2,
    road_id: 689,
    municipality_id: 5,
    zip_code_id: 700,
    name: "Geilin",
    x: 222087.04,
    y: 902257.28
  }
]
```

##Veikleikar og betringar
Hesir veikleikarnir eru staðfestir og hesar betringarnar kunnu gerast
* Flyta funktionalitet í modulir. Server.js kann lættliga gerast ógreitt og torført at viðlíkahalda.

* Flyta routes í modulir. Routes verður lættari at umsita, um hesar verða løgd í modulir.

* UTF8-trupulleikar. Eri ikki vísur í, hvar trupulleikin liggur. Mítt besta boð er lesingin av fílunum.

* Betra um umsitingarliga partin við til dømis login. Øll hava rættindi at uploada fílar.

* Innihaldið á fílunum verður ikki kannað. Kann geva feilir, um innihaldið broytist.

* Ein ávísur fílur hoyrir til ávíst input-felt. Skipanin krasjar, um skeivur fílur verður uploadaður í skeivum felti. Betri eftirlit.

* Óhóskandi navngeving av kolonnum. Sambandið millum kolonnurnar skal vera greiðari. Ivamál er, um føroysk heiti skulu nýtast ella ei.

* Fleiri kolonnur kunnu vera við. Allar kolonnurnar eru ikki við, sum til dømis navn á bygdum í hvørjumfalli.

* Leggja routes afturat, sum møguliga mangla. til dømis /vegur/id/kommuna ella vegur/id/bygd fyri at fáa kommununa og bygdina, ið vegurin hoyrir til.

* Hóskandi feilboð, tá feilir henda. Sum til dømis, tá onki samband fæst við databasan.

* ~~Betri readme. Yvirlitið yvir endaknútarnar er ikki nóg greitt.~~ [22-02-2017]

Óivað er annað, ið eisini kann gerast betur.
