# Endamál
At gera ein Node API servara, ið veitir yvirlit yvir kommunur, vegir, bygdir og bústadir í Føroyum í JSON

##Byrja her
* Byrja við at gera tær ein databasa. Eg havi brúkt navnið *addresses*, men tú kanst velja, hvussu databasin skal eita. Minst bara til at broyta databasunavnið, tá tú bindur í databasuservaran. Uppsetanin til tabellurnar er í rótini og fílurin eitur [sql.sql](https://github.com/signarit/adressur/blob/master/sql.sql)

* Rætta linjurnar \#63-67 og áset adressuna til databasuservaran, brúkaranavn, loyniorð og navn á databasu, sum tú júst hevur stovnað 
```
var mysql = mysql.createConnection({
	host: 'intranet.app',
	user: 'homestead',
	password: 'secret',
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
###Admin
http://localhost:3000/admin

###Kommunur
####Allar kommunur
http://localhost:3000/kommunur
####Ávís kommuna
http://localhost:3000/kommuna/*id*
####Ávís kommuna við bygdum
http://localhost:3000/kommuna/*id*/bygdir
####Ávís kommuna við vegnum
http://localhost:3000/kommuna/*id*/vegir
####Ávís kommuna við bústøðum
http://localhost:3000/kommuna/*id*/bustadir

###Postnummur
####Øll postnummur
http://localhost:3000/postnummur
####Øll postnummur við kommunum
http://localhost:3000/postnummur/kommunur
####Ávíst postnummar
http://localhost:3000/postnummar/*id*
####Ávíst postnummar við kommunu
http://localhost:3000/postnummar/*id*/kommuna
####Ávíst postnummar við vegum
http://localhost:3000/postnummar/*id*/vegir
####Ávíst postnummar við bústøðum
http://localhost:3000/postnummar/*id*/bustadir


###Bygdir
####Allar bygdir
http://localhost:3000/bygdir
####Allar bygdir við kommunum
http://localhost:3000/bygdir/kommunur
####Ávís bygd
http://localhost:3000/bygd/*id*
####Ávís bygd við vegum
http://localhost:3000/bygd/*id*/vegir
####Ávís bygd við bústøðum
http://localhost:3000/bygd/*id*/bustadir


###Vegir
####Allir vegir
http://localhost:3000/vegir
####Ávísur vegur
http://localhost:3000/vegur/*id*
####Ávísur vegur við bústøðum
http://localhost:3000/vegur/*id*/bustadir

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

9. Betri readme. Yvirlitið yvir endaknútarnar er ikki nóg greitt.

Óivað er annað, ið eisini kann gerast betur.
