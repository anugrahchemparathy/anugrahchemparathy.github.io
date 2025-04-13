---
layout: page
title: Blog
permalink: /blog/
---

<div class="blog-posts">
  {% for post in site.posts limit:5 %}
    <div class="post-preview">
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
      <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
      <a href="{{ post.url | relative_url }}">Read more →</a>
    </div>
    {% unless forloop.last %}<hr class="post-divider">{% endunless %}
  {% endfor %}
</div>