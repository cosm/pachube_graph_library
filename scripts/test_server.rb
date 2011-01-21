#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'
require 'haml'

p File.dirname(__FILE__) + '/../public'

set :public, File.dirname(__FILE__) + '/../public'

get '/' do
  haml :index
end

get '/env' do
  haml :env
end

__END__

@@ index
%html
  %head
    %title Choose an environment
  %body
    %h1 Choose an environment
    %form{:action => "/env"}
      %fieldset
        %legend Data
        %ul
          %li
            %label Environment id:
            %input{:type => "text", :name => "id", :value => "504"}
          %li
            %label Datastream id:
            %input{:type => "text", :name => "stream_id", :value => "1"}
          %li
            %label Api key:
            %input{:type => "text", :name => "key", :value => ""}
      %fieldset
        %legend Graph
        %ul
          %li
            %label Rolling:
            %input{:type => "checkbox", :name => "rolling", :value => "true"}
          %li
            %label Update:
            %input{:type => "checkbox", :name => "update", :value => "true"}
          %li
            %label Default Timespan:
            %select{:name => "timespan"}
              %option{:value => "last hour"} last hour
              %option{:value => "24 hours", :selected => true} 24 hours
              %option{:value => "4 days"} 4 days
              %option{:value => "3 months"} 3 months
          %li
            %label Size:
            %input{:type => "text", :name => "width", :value => "640"}
            px X 
            %input{:type => "text", :name => "height", :value => "480"}
            px
      %ul
        %li
          %input{:type => "submit"}

@@ env
!!! 1.1
%html
  %head
    %title Viewing Environment #{params['id']}
    %script{:src => "/lib/PachubeLoader.js"}
  %body>
    #graph.pachube-graph{"pachube-resource" => "/feeds/#{params['id']}/datastreams/#{params['stream_id']}", "pachube-key" => "#{params['key']}", "pachube-options" => "#{params['rolling'] ? "rolling: true;" : ""}#{params['update'] ? "update: true;" : ""}#{params['timespan'] ? "timespan:#{params['timespan']};" : ""}", :style => "width:#{params['width']}px;height:#{params['height']}px;background:#EEE;"}
      Graph #{params['id']}
