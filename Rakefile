require 'rake'

desc 'Default: Run tests.'
task :default => :test

desc 'Test the js widgets.'
task :test do
  sh 'firefox jswidgets/test/index.html'
end

desc 'Run jscoverage tests.'
task :coverage do
  directory = File.dirname(__FILE__)
  sh "rm -r #{directory}/instrumented" if File.directory?("#{directory}/instrumented")
  sh "#{directory}/jscoverage/jscoverage #{directory}/jswidgets #{directory}/instrumented"
  sh "firefox #{directory}/instrumented/jscoverage.html"
end
