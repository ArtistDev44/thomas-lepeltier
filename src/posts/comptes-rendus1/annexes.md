---
title: "Compte-rendus depuis 1998"
date: Last Modified
layout: "page.njk"
permalink: "/comptes-rendus/index.html"
---

Persuadés que trop d'essais ne trouvent pas le nombre de lecteurs qu'ils méritent, nous avons trouvé intéressant d'utiliser le réseau Internet pour en publier des comptes rendus afin de les faire connaître à un plus large public.
 
Mais plutôt que d'écrire de simples « annonces publicitaires » qui n'apprennent presque rien sur le contenu des ouvrages ou, à l'inverse, des études critiques qui ne sont compréhensibles que par ceux qui ont déjà lu les livres en question, nous avons décidé de présenter explicitement et aussi simplement que possible certaines idées développées par les auteurs. Nos lecteurs pourront ainsi apprécier, par eux-mêmes, l'intérêt de ces ouvrages.
       
<hr>

<ol>
  {%- for rapport in collections.Rapports | reverse -%}
    <li><a href="{{ rapport.data.permalink }}">{{ rapport.data.title }} - {{ rapport.data.date.toLocaleString( undefined, { year: 'numeric' }) }}</a></li>
    <div class="tags-container">
      {%- for tag in rapport.data.tags -%}
        {%- if tag != "Rapports" -%}
          <a href="/tags/{{ tag | slugify }}">
            <span slot="tag" class="button">{{ tag }}</span>
          </a>
        {%- endif -%}
      {%- endfor -%}
    </div>
  {%- endfor -%}
</ol>
