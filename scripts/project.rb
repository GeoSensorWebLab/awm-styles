#!/usr/bin/env ruby
# Merges database.yaml settings on top of project.yaml and outputs a JSON
# file for kosmtik.

require 'json'
require 'yaml'

project = IO.read('project.yaml')
db_settings = IO.read('database.yaml')

updated_project = YAML.load(db_settings + "\n" + project)

IO.write('arcticwebmap.mml', JSON.pretty_generate(updated_project))
