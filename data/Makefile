hogares:
	curl -o hogares.zip "http://www3.inegi.org.mx/contenidos/proyectos/enchogares/regulares/enigh/nc/2014/microdatos/ncv_hogares_2014_concil_2010_csv.zip"
	unzip hogares.zip
	sed -r "s/;/,/g" *.csv > hogares.csv
	mongoimport -d enigh -c hogares --type csv --headerline --file hogares.csv
	mongo hogares.js
	mongoexport -d enigh -c electro --type csv --out out.csv -f num_ester,num_grab,num_radio,num_tva,num_tvd,num_dvd,num_licua,num_tosta,num_micro,num_refri,num_refri,num_lavad,num_planc,num_maqui,num_venti,num_aspir,num_compu,num_impre,num_juego

clean:
	rm *.csv; rm *.zip
