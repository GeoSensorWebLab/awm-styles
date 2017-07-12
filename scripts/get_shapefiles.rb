#!/usr/bin/env ruby
# Reads shapefile information from shapefiles.yaml to download and process the
# shapefiles for mapnik.

require 'fileutils'
require 'yaml'

shapefiles = YAML.load(IO.read('shapefiles.yaml'))

# Basic Initialization
FileUtils.mkdir_p("data")

# Create and populate data directory
def initialize_directory(name)
  FileUtils.mkdir_p("data/#{name}")
end

# Download pack
# Uses external curl. Will only download if the remote file has a different
# modified-date. Returns the filename.
def download_pack(url)
  filename = File.basename(url)
  `curl -z "data/#{filename}" -L -o "data/#{filename}" "#{url}"`
  filename
end

# Decompress packs
UNZIP_OPTS = "-qqunj"
def decompress_pack(file)
  if file.match(/tgz$/) != nil
    `tar xzf data/#{file} -C data/`
  elsif file.match(/zip$/) != nil
    base = File.basename(file, ".zip")
    `unzip #{UNZIP_OPTS} data/#{file} -d data/#{base}`
  else
    puts "Unknown archive"
    exit 1
  end
end

# Process shapefiles

def clip(input, options = {})
  base = File.basename(input, ".shp")
  clip_tmpfile = "/tmp/#{base}.#{$$}.clip.shp"
  `ogr2ogr -t_srs #{options[:clip_srs]} -clipdst #{options[:clip_bounds]} "#{clip_tmpfile}" "#{input}"`
  clip_tmpfile
end

def segmentize(input, options = {})
  base = File.basename(input, ".shp")
  segment_tmpfile = "/tmp/#{base}.#{$$}.segment.shp"
  `ogr2ogr -segmentize #{options[:segment_interval]} "#{segment_tmpfile}" "#{input}"`
  segment_tmpfile
end

def reproject(input, options = {})
  base = File.basename(input, ".shp")
  reproject_tmpfile = "/tmp/#{base}.#{$$}.reproject.shp"
  `ogr2ogr -t_srs #{options[:project_to_srs]} "#{reproject_tmpfile}" "#{input}"`
  reproject_tmpfile
end

def save(input, directory, original)
  base = File.basename(input, ".shp")
  Dir.glob("/tmp/#{base}*").each do |tmpfile|
    tmpfile_base = File.basename(tmpfile)
    extension = File.extname(tmpfile_base)
    FileUtils.cp(tmpfile, "data/#{directory}/proc_#{original}#{extension}")
  end
end

# Processing Iterator
shapefiles.each do |shapefile|
  name = shapefile["name"]
  initialize_directory(name)

  puts "\nDownloading #{name}…"
  filename = download_pack(shapefile["url"])

  puts "\nExpanding #{filename}…"
  decompress_pack(filename)

  # Remove previously processed files
  FileUtils.rm_f(Dir.glob("data/#{name}/proc_*"))

  processed = []
  files = Dir.glob("data/#{name}/*.shp")

  # If a filter regex is specified, we will only process matching files
  if shapefile["shapefile_regex"] != nil
    files = files.find_all { |i|
      i.match(shapefile["shapefile_regex"]) != nil
    }
  end

  files.each do |shp|
    puts "\nProcessing #{shp}…"
    processed.push(shp)

    # clip
    puts "Clipping…"
    base = File.basename(shp, ".shp")
    clipped = clip(shp, {
      clip_bounds: shapefile["clip_bounds"],
      clip_srs: shapefile["clip_srs"]
    })

    # segment
    puts "Segmentizing…"
    segmented = segmentize(clipped, {
      segment_interval: shapefile["segment_interval"]
    })

    # reproject
    puts "Reprojecting…"
    reprojected = reproject(segmented, {
      project_to_srs: shapefile["project_to_srs"]
    })

    # save
    save(reprojected, name, base)
  end

  processed.each do |file|
    puts "\nIndexing #{file}…"
    base = File.basename(file, ".shp")
    `shapeindex --shape_files data/#{name}/proc_#{base}.shp`
  end
end

# Cleanup

FileUtils.rm_f(Dir.glob("/tmp/*.clip.*"))
FileUtils.rm_f(Dir.glob("/tmp/*.segment.*"))
FileUtils.rm_f(Dir.glob("/tmp/*.reproject.*"))
