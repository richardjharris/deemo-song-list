all: songs.json

install: songs.json
	cp songs.json ../src/songs.json

note-counts.txt: wiki-dumps/song-list
	perl bin/get-note-counts < wiki-dumps/song-list > $@

songs.json: wiki-dumps/platform-info note-counts.txt wiki-dumps/song-list
	perl bin/parse-wiki-song-list wiki-dumps/platform-info note-counts.txt \
	    < wiki-dumps/song-list > $@

clean:
	rm songs.json note-counts.txt
