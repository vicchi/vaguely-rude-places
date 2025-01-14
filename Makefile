SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -O extglob -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

VAULT := homelab

ifndef HOMELAB_OP_SERVICE_ACCOUNT_TOKEN
$(error HOMELAB_OP_SERVICE_ACCOUNT_TOKEN is not set in your environment)
endif

.PHONY: dotenv
dotenv: .env

.env: .env.template
	OP_SERVICE_ACCOUNT_TOKEN=${HOMELAB_OP_SERVICE_ACCOUNT_TOKEN} VAULT=$(VAULT) op inject --force --in-file $< --out-file $@

# Wrap the build in a check for an existing .env file
ifeq ($(shell test -f .env; echo $$?), 0)
include .env
ENVVARS := $(shell sed -ne 's/ *\#.*$$//; /./ s/=.*$$// p' .env )
$(foreach var,$(ENVVARS),$(eval $(shell echo export $(var)="$($(var))")))

.PHONY: clean
clean:
	grunt clean

.PHONY: build
build:
	grunt build

.PHONY: deploy
deploy:
	rsync --progress -e ssh -rav --delete dist/vaguely-rude-places/ ${USERNAME}@${HOSTNAME}:${DEPLOY_ROOT}/${HOSTNAME}/webroot

# No .env file; fail the build
else
.DEFAULT:
	$(error Cannot find a .env file; run make dotenv)
endif
