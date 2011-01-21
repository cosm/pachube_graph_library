#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'
require 'haml'

p File.dirname(__FILE__) + '/../public'

set :public, File.dirname(__FILE__) + '/../public'

helpers do
  include Rack::Utils
  alias_method :h, :escape_html
end

get '/' do
  haml :index
end

get '/env' do
  @head_html = <<-EOF
<script type="text/javascript" src="http://www.pachube.com/widgets/PachubeLoader.js"></script>
EOF
  options = %w(timespan rolling update background-color line-color grid-color border-color text-color).collect { |param|
    params[param] ? "#{param}:#{params[param]};" : ""
  }.join
  @graph_html = <<-EOF
<div id="graph" class="pachube-graph" pachube-resource="/feeds/#{h params['id']}/datastreams/#{h params['stream_id']}" pachube-key="#{h params['key']}" pachube-options="#{h options}" style="width:#{h params['width']}px;height:#{h params['height']}px;background:#{h params['background']};">
  Graph #{h params['id']}
</div>
EOF
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
        %legend Graph Functionality
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
      %fieldset
        %legend Graph Appearance
        %ul
          %li
            %label Size:
            %input{:type => "text", :name => "width", :value => "640"}
            px by
            %input{:type => "text", :name => "height", :value => "480"}
            px
          %li
            %label Background Color:
            %input{:type => "text", :name => "background", :value => "#FFFFFF"}
          %li
            %label Grid Background Color:
            %input{:type => "text", :name => "background-color", :value => "#FFFFFF"}
          %li
            %label Line Color:
            %input{:type => "text", :name => "line-color", :value => "#FF0066"}
          %li
            %label Grid Color:
            %input{:type => "text", :name => "grid-color", :value => "#EFEFEF"}
          %li
            %label Border Color:
            %input{:type => "text", :name => "border-color", :value => "#9D9D9D"}
          %li
            %label Text Color:
            %input{:type => "text", :name => "text-color", :value => "#555555"}
      %ul
        %li
          %input{:type => "submit"}

@@ env
!!! 1.1
%html
  %head
    %title Viewing Environment #{params['id']}
    %script{:src => "/lib/PachubeLoader.js"}
  %body
    %p
      %h3 In the head, put:
      %textarea{:cols => "80", :rows => "6"}
        = h @head_html
      %h3 In the body, put:
      %textarea{:cols => "80", :rows => "6"}
        = h @graph_html
    %p
      %h3 Result:
      = @graph_html
