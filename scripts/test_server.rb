#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'

p File.dirname(__FILE__) + '/../lib'

set :public, File.dirname(__FILE__) + '/../lib'

get '/' do
  '<html><head><title>Choose an environment</title></head><body><h1>Choose an environment</h1><form action="/env"><input type="text" name="id" value="7535" /><input type="submit" /></form></body></html>'
end

get '/env' do
  %|<html><head><title>Viewing Environment #{params['id']}</title><script src="/pbloader.js?key=abc123"></script></head><body><div id="graph" class="pachube-graph feed-#{params['id']}-stream-0" style="width:640px;height:480px;background:#EEE;">Graph #{params['id']}</div></body></html>|
end