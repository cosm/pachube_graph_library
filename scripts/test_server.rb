#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'

p File.dirname(__FILE__) + '/../public'

set :public, File.dirname(__FILE__) + '/../public'

get '/' do
  '<html><head><title>Choose an environment</title></head><body><h1>Choose an environment</h1><form action="/env">Environment id:<br /><input type="text" name="id" value="504" /><br />Datastream id:<br /><input type="text" name="stream_id" value="1" /><br />Api key:<br /><input type="text" name="key" value="" /><br /><input type="submit" /></form></body></html>'
end

get '/env' do
  %|<!DOCTYPE html><html><head><title>Viewing Environment #{params['id']}</title><script src="/pbloader.js"></script></head><body><div id="graph" class="pachube-graph" pachube-resource="feeds/#{params['id']}/datastreams/#{params['stream_id']}" pachube-key="#{params['key']}" static update="auto" style="width:640px;height:480px;background:#EEE;">Graph #{params['id']}</div></body></html>|
end
