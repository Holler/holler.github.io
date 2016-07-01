source 'https://rubygems.org'
ruby '2.3.0'

gem 'jekyll-redirect-from'
gem 'jekyll-sitemap'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']
