set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

default:
  @just --list

install:
  bun install

build:
  bun run build

check:
  bun run check

update-manifest:
  bun run check --update

e2e:
  bun run test:e2e

test:
  bun run test

bump tag:
  bun run bump {{tag}}
