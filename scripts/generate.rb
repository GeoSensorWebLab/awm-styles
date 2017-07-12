#!/usr/bin/env ruby

require 'fileutils'
require 'json'
require 'yaml'

AWM_STYLES = 'awm-styles.yaml'

styles = YAML.load(IO.read(AWM_STYLES))["styles"]
base_project = YAML.load(IO.read('project.yaml'))
db_settings = YAML.load(IO.read('database.yaml'))
updated_project = project.merge(db_settings)

yaml_options = { line_width: -1 }

styles.each do |style|
  puts "Generating #{style["name"]}…"
  # Customize Project
  project = updated_project.clone
  project["name"] = style["name"]
  project["description"] = style["description"]
  project["srs"] = style["srs"]

  # Writeout as MML file
  IO.write(style["basename"] + ".mml", JSON.pretty_generate(project))

  # Convert to XML using carto
  `carto #{style["basename"]}.mml > #{style["basename"]}.xml`

  # Remove intermediary MML file
  FileUtils.rm(style["basename"] + ".mml")
end
