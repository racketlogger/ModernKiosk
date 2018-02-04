all:
	(cd extension && web-ext build --overwrite-dest)

lint:
	(cd extension && web-ext lint)

