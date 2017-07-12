#!/usr/bin/env ruby
# Merges database.yaml settings on top of project.yaml and outputs a JSON
# file for kosmtik.

require 'json'
require 'yaml'

project = YAML.load(IO.read('project.yaml'))
db_settings = YAML.load(IO.read('database.yaml'))

updated_project = project.merge(db_settings)
IO.write('arcticwebmap.mml', JSON.pretty_generate(updated_project))
