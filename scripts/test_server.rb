#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'
require 'haml'

p File.dirname(__FILE__) + '/../public'

set :public, File.dirname(__FILE__) + '/../public'
set :haml, :format => :html5

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
!!!
%html
  %head
    %meta{:charset => 'utf-8'}
    %title Choose an environment
    %link{:rel => "stylesheet", :href => "css/blueprint/screen.css", :type => "text/css", :media => "screen, projection"}
    %link{:rel => "stylesheet", :href => "css/blueprint/print.css", :type => "text/css", :media => "print"}
    /[if lt IE 8]
      %link{:rel => "stylesheet", :href => "css/blueprint/ie.css", :type => "text/css", :media => "screen, projection"}
    %link{:rel => "stylesheet", :href => "/css/default.css", :media => "screen"}
    %script{:href => "/js/default.js"}
  %body
    .container
      %h1 Pachube Embeddable Graph Generator
      %form.span-12{:action => "#", :id => 'ourForm'}
        %fieldset
          %legend
            %h2 Data

          .label.span-4
            %label Feed ID:
          .input.span-4
            %input{:type => "text", :name => "id", :placeholder => "504"}
          .notes.span-4.last
            ← Which Pachube feed are we getting data from?

          .label.span-4
            %label Datastream ID:
          .input.span-4
            %input{:type => "text", :name => "stream_id", :placeholder => "1"}
          .notes.span-4.last
            ← This is the datastream to graph.  It must contain numeric data.

          .label.span-4
            %label API Key:
          .input.span-4
            %input{:type => "text", :name => "key", :value => ""}
          .notes.span-4.last
            ← This is the API Key used to set up this graph.  Because this will be publicly accessible, a great choice is to use a GET-only Secure Sharing Key.

        %fieldset
          %legend
            %h2 Graph Functionality

          .label.span-4
            %label Rolling:
          .input.span-4
            %input{:type => "checkbox", :name => "rolling", :checked => true}
          .notes.span-4.last
            ← Should this graph finish "now"?  If selected the right-edge of this graph will be the time when it was loaded.

          .label.span-4
            %label Auto-Update:
          .input.span-4
            %input{:type => "checkbox", :name => "update", :checked => true}
          .notes.span-4.last
            ← Should this graph automatically update as new data is received? 

          .label.span-4
            %label Default Timespan:
          .input.span-4
            %select{:name => "timespan"}
              %option{:value => "last hour"} last hour
              %option{:value => "24 hours", :selected => true} 24 hours
              %option{:value => "4 days"} 4 days
              %option{:value => "3 months"} 3 months
          .notes.span-4.last
            ← Which timespan should this graph default to?

        %fieldset
          %legend
            %h2 Graph Appearance

          .label.span-4
            %label Width:
          .input.span-4
            %input{:type => "text", :name => "width", :value => "320"}
            px
          .notes.span-4.last
            ← How wide should this graph be?

          .label.span-4
            %label Height:
          .input.span-4
            %input{:type => "text", :name => "height", :value => "240"}
            px
          .notes.span-4.last
            ← How tall should this graph be?

          .label.span-4
            %label Background Color:
          .input.span-4
            %input{:type => "text", :name => "background", :value => "#FFFFFF"}
          .notes.span-4.last
            ← What colour should the background of this graph be?

          .label.span-4
            %label Grid Background Color:
          .input.span-4
            %input{:type => "text", :name => "background-color", :value => "#FFFFFF"}
          .notes.span-4.last
            ← What colour should the grid background of this graph be?

          .label.span-4
            %label Line Color:
          .input.span-4
            %input{:type => "text", :name => "line-color", :value => "#FF0066"}
          .notes.span-4.last
            ← What colour should the line be?

          .label.span-4
            %label Grid Color:
          .input.span-4
            %input{:type => "text", :name => "grid-color", :value => "#EFEFEF"}
          .notes.span-4.last
            ← What colour should the grid be?

          .label.span-4
            %label Border Color:
          .input.span-4
            %input{:type => "text", :name => "border-color", :value => "#9D9D9D"}
          .notes.span-4.last
            ← What colour should the border around the graph be?

          .label.span-4
            %label Text Color:
          .input.span-4
            %input{:type => "text", :name => "text-color", :value => "#555555"}
          .notes.span-4.last
            ← What colour should the text on the graph be?

        .label.span-4
          %label
            &nbsp;
        .input.span-4.last
          %input{:type => "submit", :value => "Generate HTML"}
        .notes.span-4.last{:style => "text-align: right;"}
          Let's Go! →
      .span-12.last
        %p#result
          %h2 Result
        %p
          %h2 In the head, put:
          %textarea{:cols => "160", :rows => "4", :id => "head_html"}
          %h2 In the body, put:
          %textarea{:cols => "160", :rows => "6", :id => "body_html"}

@@ env
!!!
%html
  %head
    %meta{:charset => 'utf-8'}
    %title Viewing Environment #{params['id']}
    %link{:rel => "stylesheet", :href => "css/blueprint/screen.css", :type => "text/css", :media => "screen, projection"}
    %link{:rel => "stylesheet", :href => "css/blueprint/print.css", :type => "text/css", :media => "print"}
    /[if lt IE 8]
      %link{:rel => "stylesheet", :href => "css/blueprint/ie.css", :type => "text/css", :media => "screen, projection"}
    %link{:rel => "stylesheet", :href => "/css/default.css", :media => "screen"}
    %script{:src => "/lib/PachubeLoader.js"}
  %body
    .container
      .span-12
        %p
          %h2 Result
          = @graph_html
        %p
          %h2 In the head, put:
          %textarea{:cols => "160", :rows => "4"}
            = h @head_html
          %h2 In the body, put:
          %textarea{:cols => "160", :rows => "6"}
            = h @graph_html
