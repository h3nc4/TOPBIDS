.PHONY: all core guard helper

all: core guard helper

core:
	tar --transform 's|^|opt/|' -czf core.tgz core/

guard:
	tar --transform 's|^|opt/|' -czf guard.tgz guard/

helper:
	tar --transform 's|^|opt/|' -czf helper.tgz helper/

clean:
	rm *.tgz
