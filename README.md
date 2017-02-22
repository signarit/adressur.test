# Endamál
At gera ein Node API servara, ið veitir yvirlit yvir kommunur, vegir, bygdir og bústadir í Føroyum í JSON

##Byrja her
* Byrja við at gera tær ein databasa. Eg havi brúkt navnið *addresses*, men tú kanst velja, hvussu databasin skal eita. Minst bara til at broyta databasunavnið, tá tú bindur í databasuservaran. Uppsetanin til tabellurnar er í rótini og fílurin eitur [sql.sql](https://github.com/signarit/adressur/blob/master/sql.sql)

* Rætta linjurnar \#63-67 og áset adressuna til databasuservaran, brúkaranavn, loyniorð og navn á databasu, sum tú júst hevur stovnað 
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

* Far inn á [http://localhost:3000/admin](http://localhost:3000/admin) og uploada fílarnar, ið liggja í [public/upload](https://github.com/signarit/adressur/tree/master/public/upload) 

| Fílnavn | Frágreiðing | Leinkja |
--- | --- | ---
adr.txt | Hevur allar bústaðir í Føroyum | [adr.txt] (https://github.com/signarit/adressur/blob/master/public/upload/adr.txt)
kommunur.txt | Hevur allar kommunur í Føroyum | [kommunur.txt] (https://github.com/signarit/adressur/blob/master/public/upload/kommunur.txt)
postnr.txt | Hevur øll postnummur í Føroyum | [postnr.txt] (https://github.com/signarit/adressur/blob/master/public/upload/postnr.txt)
veg.txt | Hevur allar vegir í Føroyum | [veg.txt] (https://github.com/signarit/adressur/blob/master/public/upload/veg.txt)

Tá fílarnir verða uploadaðir, fáa teir nýtt navn, sum hevur formin YYYY_MM_DD_\<fílnavn\>. Hetta er tí, at tað altíð skal vera møguligt at síggja gomlu fílarnar. Tá ein fílur verður uploadaður, verður hann lisin og goymdur í databasanum.

Nú kanst tú t.d. vitja [http://localhost:3000/kommunur](http://localhost:3000/kommunur)

##Endaknútar (endpoints)

| Lýsing | Háttur | Endaknútur
---|---|---
| Umsiting av síðuni | GET | /admin
| Uploading av fílum | POST | /upload
| Allar kommunur | GET | /kommunur
| Ávís kommuna | GET | /kommuna/**_id_**
| Ávís kommuna við bygdum | GET | /kommuna/**_id_**/bygdir
| Ávís kommuna við vegnum | GET | /kommuna/**_id_**/vegir
| Ávís kommuna við bústøðum | GET | /kommuna/**_id_**/bustadir
| Øll postnummur | GET | /postnummur
| Øll postnummur við kommunum | GET | /postnummur/kommunur
| Ávíst postnummar | GET | /postnummar/**_id_**
| Ávíst postnummar við kommunu | GET | /postnummar/**_id_**/kommuna
| Ávíst postnummar við vegum | GET | /postnummar/**_id_**/vegir
| Ávíst postnummar við bústøðum | GET | /postnummar/**_id_**/bustadir
| Allar bygdir | GET | /bygdir
| Allar bygdir við kommunum | GET | /bygdir/kommunur
| Ávís bygd | GET | /bygd/**_id_**
| Ávís bygd við vegum | GET | /bygd/**_id_**/vegir
| Ávís bygd við bústøðum | GET | /bygd/**_id_**/bustadir
| Allir vegir | GET | /vegir
| Ávísur vegur | GET | /vegur/**_id_**
| Ávísur vegur við bústøðum | GET | /vegur/**_id_**/bustadir

##Veikleikar og betringar
Hesir veikleikarnir eru staðfestir og hesar betringarnar kunnu gerast

1. Innihaldið á fílunum verður ikki kannað. Kann geva feilir, um innihaldið broytist.

2. Øll kunnu uploada fílar. Kann krasja skipanina.

3. Ein ávísur fílur hoyrir til ávíst input-felt. Skipanin krasjar, um skeivur fílur verður uploadaður í skeivum felti.

4. UTF8-trupulleikar. Eri ikki vísur í, hvar trupulleikin liggur.

5. Óhóskandi navngeving av kolonnum. Sambandið millum kolonnurnar kundi kanska verið greiðari.

6. Fleiri kolonnur kunnu vera við. Allar kolonnurnar eru ikki við, sum til dømis navn á bygdum í hvørjumfalli.

7. Ógjøgnumhugsaðar routes. Kanska onkrar mangla.

8. Manglandi testing. Skipanin er ikki testað út í æsir.

9. ~~Betri readme. Yvirlitið yvir endaknútarnar er ikki nóg greitt.~~

Óivað er annað, ið eisini kann gerast betur.
