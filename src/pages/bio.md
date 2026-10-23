---
title: Ma biographie
eyebrow: Qui suis-je ?
lead: Docteur en astrophysique, historien et philosophe des sciences, je travaille sur les grandes controverses scientifiques, philosophiques et éthiques de notre temps.
permalink: /bio/index.html
description: 'Thomas Lepeltier, docteur en astrophysique, historien et philosophe des sciences : parcours, affiliations et ouvrages.'
layout: page
---

<div class="bio-layout">

<div class="flow">

<h2>Une œuvre consacrée aux controverses</h2>

<p>Je développe depuis plusieurs années une œuvre consacrée aux grandes controverses scientifiques, philosophiques et éthiques contemporaines. La presse salue la clarté, la rigueur et l’originalité de mes ouvrages : j’expose les arguments en présence sans caricature, je rends accessibles des débats complexes et j’interroge les certitudes établies avec indépendance.</p>

<h2>Éthique animale et transition écologique</h2>

<p>Concernant l’éthique animale, je suis « Associate Fellow » du « Oxford Centre for Animal Ethics » et co-fondateur de <em>L’Amorce. Revue contre le spécisme</em>.</p>

<p>Engagé dans les réflexions sur la transition écologique et sociétale, je dirige également le pôle <em>think tank</em> d’<strong>APALA</strong>. Cette association nantaise, structurée comme un <em>think &amp; do tank</em>, promeut une approche rationnelle, scientifique et critique : identifier les leviers d’action les plus efficaces, écarter les fausses bonnes idées et soutenir des projets concrets de transition.</p>

<h2>Un travail de recension exigeant</h2>

<p>Je me suis fait connaître par un travail de recension exigeant, clair et indépendant. Lecteurs, universitaires, chercheurs et auteurs y reconnaissent la rigueur intellectuelle, la fidélité aux œuvres analysées et la capacité à rendre accessibles des sujets complexes sans les simplifier abusivement.</p>

</div>

<aside class="bio-aside" aria-label="En bref">
<figure>
<img src="/assets/images/profil/thomas-lepeltier.jpg" alt="Thomas Lepeltier assis dans un fauteuil, micro en main, lors d’une rencontre" loading="lazy">
</figure>
<div class="facts">
<h2>Engagements</h2>
<dl>
<div><dt>Oxford Centre for Animal Ethics</dt><dd>Associate Fellow</dd></div>
<div><dt>L’Amorce. Revue contre le spécisme</dt><dd>Co-fondateur</dd></div>
<div><dt>APALA, Nantes</dt><dd>Direction du pôle <em>think tank</em></dd></div>
</dl>
</div>
</aside>

</div>

<section class="page-section" aria-labelledby="sur-ce-site">

<h2 id="sur-ce-site">Sur ce site</h2>

<ul class="quicknav" role="list">
<li><a href="/livres/"><span class="quicknav__title">Mes livres</span><span class="quicknav__text">{{ collections.mesLivres | length }} livres en tant qu’auteur et {{ collections.livresDiriges | length }} que j’ai dirigés.</span></a></li>
<li><a href="/livres/#contributions"><span class="quicknav__title">Contributions</span><span class="quicknav__text">Les {{ contributions | length }} livres auxquels j’ai contribué.</span></a></li>
<li><a href="/chroniques/"><span class="quicknav__title">Chroniques</span><span class="quicknav__text">Plus de 500 chroniques de livres.</span></a></li>
<li><a href="/articles/"><span class="quicknav__title">Articles</span><span class="quicknav__text">Plus d’une centaine d’articles et d’entretiens.</span></a></li>
</ul>

</section>

<section class="page-section" aria-labelledby="critiques-de-reference">

<h2 id="critiques-de-reference">Critiques de référence</h2>

<p class="lead">Ce qu’en disent des lecteurs, universitaires et chercheurs.</p>

{% set itemList = collections.critiquesg %}
{% set headingLevel = "h3" %}
{% include 'partials/details.njk' %}

</section>
