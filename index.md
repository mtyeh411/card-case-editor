---
layout: base
---

{% for category in site.categories %}
  <h3 class="title">{{ category[0] | split: "-" | join: " "}}</h3>
  <ul>
    {% for post in category[1] %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </li>
    {% endfor %}
  </ul>
{% endfor %}
