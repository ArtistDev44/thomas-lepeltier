import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const markdownContent = `---
title: Commentaires de revues de livres
permalink: false
description: 'Commentaires sur les articles de Revue de Livres'
tags: "critiquesg"
layout: page
---

*Publiés avec l'autorisation de leurs auteurs*

> « Je pense sincèrement que votre texte est ce que j'ai lu de mieux sur le Cours [que Michel Foucault a donné au Collège de France, en 1976]. En général, les commentaires n'ont pas compris l'ossature du texte, ou bien n'ont pas voulu comprendre, se limitant presque uniquement à l'examen de la dernière partie qui est incompréhensible sans ce qui la précède. [...] Or, la seule lecture de votre compte rendu permet de ne pas tomber dans ces travers [...] encore bravo. »
>
> **Alessandro FONTANA,**
> Responsable de l'édition des cours de Michel Foucault.

> « Décidément vos fiches de lecture sont excellentes, et vous rendez davantage service à la pensée de tous à vous seul que les dizaines de homepages et sites intellectuels divers qui, sur le web français n'existent que pour faire de la simple figuration. Non, vraiment votre travail est extraordinaire, et, j'en suis sûr, précieux pour beaucoup de gens ! »
>
> **Frédéric DELORCA,**
> Administrateur d'un site philosophique.

> « Je suis toujours avec intérêt vos publications, d'excellent niveau et de grande rigueur. Elles sont une aide précieuse pour faire découvrir des ouvrages dont on n'aurait pas forcément eu connaissance, et je vous suis reconnaissant du travail que vous faites au service de la pensée et plus généralement de la culture. »
>
> **Jean-Pierre LALLOZ,**
> Professeur de philosophie en Lettres supérieures.

> « En donnant un aperçu digeste de sujets parfois difficiles "Revue de Livres" donne au néophyte l'envie de sortir des lectures convenues. La qualité de sa rédaction et le choix des ouvrages traités en font un îlot d'excellence dans l'océan de médiocrité que devient Internet. »
>
> **Roland LEHOUCQ,**
> Chercheur en Astrophysique
> au Commissariat à l'Énergie Atomique.

> « Une "Revue de livres" sur internet. Rien que de très naturel, eu égard au développement de ce support d'information, et de l'usage croissant que les professionnels du livre, libraires en tête, font du web. Mais encore fallait-il y penser, mettre l'idée en oeuvre, et de façon convaincante. C'est chose faite. À tous égards, l'entreprise courageuse et salutaire de Thomas Lepeltier est une réussite : des comptes-rendus substantiels et bien écrits, plus comparables à certains articles de la presse littéraire anglo-saxonne qu'aux tristes papiers de commande qui trônent trop souvent dans nos quotidiens et nos magazines hexagonaux ; l'art de rendre clairs, et passionnants, des sujets  complexes, et parfois arides ; une indépendance de choix et de jugement méritoire ; des renseignements complets et précis, qui permettent ensuite d'accéder facilement aux ouvrages recensés ; une consultation simple. Bref, pour le lecteur potentiel, un maximum d'informations en un minimum de temps. Le pari semble gagné. Bravo ! »
>
> **Lucie MARIGNAC,**
> Directrice de collection aux Éditions Macula,
> Responsable des Presses de l'École Normale Supérieure.

> « J'ai lu avec attention les recensions d'ouvrages de philosophie et de théorie littéraire. J'en apprécie les qualités de jugement et de style ; je goûte leur simplicité. Ces articles sont instructifs, concis et clairs. On les lit avec plaisir. Il est  très appréciable  de bénéficier sur la Toile d'une somme de travail si utile et réalisée avec autant de soin. En outre, la gratuité de ce service (d'utilité publique !) mérite également d'être soulignée ; elle est le signe d'une générosité dont on aimerait trouver toujours davantage d'exemples sur la Toile. Je ne manquerai pas de communiquer votre adresse à mes étudiants de l'Université de Polynésie Française car, ici, à Tahiti, les livres sont des biens précieux, particulièrement coûteux et qui n'abondent pas. C'est dire l'utilité de votre travail qui décrit et analyse des ouvrages récents ou anciens, dont la valeur intellectuelle seule justifie la promotion. »
>
> **Patrick SULTAN,**
> Université de Polynésie Française.

> « Tous mes encouragements pour cette oeuvre utile et dont la rigueur intellectuelle est précieuse à vos lecteurs. »
>
> **Jean-Noël TRONC,**
> Conseiller technique pour les technologies et la société
de l'information,
> Cabinet du Premier ministre.

> « Je tiens à vous exprimer ma gratitude pour l'exactitude de votre compte rendu, qui donne de mon travail, de manière claire et concise, une vue tout à fait fidèle. »
>
> **Roger-Pol DROIT,**
> Chargé de recherche au CNRS,
> Chroniqueur au journal Le Monde.

> « I appreciate very much your perceptive review of my book on the Scrolls. I was very much impressed by the highly professional quality of your review. »
>
> **Norman GOLB,**
> Professeur à l'Université de Chigago.

> « J'ai bien reçu le compte rendu de mon Perpetuum mobile et suis enchanté que ce livre soit présenté, et si bien présenté, sur Internet. Je suis sensible à la peine que vous avez prise et à la qualité de votre lecture, sympathique et clairvoyante. Votre réserve du dernier paragraphe est tout à fait justifiée. Et comment ne pas se féliciter que, au moment où les revues perdent des abonnés, de nouveaux canaux d'informations, comme celui que vous avez adopté, soient exploités ? »
>
> **Michel JEANNERET,**
> Professeur à l'Université de Genève.

> « Merci pour le compte-rendu de mon livre La relativité dans tous ses états que vous avez déposé sur votre site Revue de Livres. J'ai trouvé ce compte-rendu très bien fait. »
>
> **Laurent NOTTALE,**
> Directeur de recherche au CNRS,
> Observatoire de Paris-Meudon.

> « La création d'un site consacré à présenter les résumés détaillés de livres me paraît être une excellente idée, qui peut contribuer à remplir une lacune existante, en France, entre les annonces à caractères publicitaires, qui reprennent les informations fort imparfaites de quatrièmes de couverture, et les articles des suppléments ou des magazines littéraires, destinés davantage à faire admirer la prose de journalistes et de critiques qu'à informer honnêtement sur le contenu des livres. Votre compte rendu de mon propre livre me semble très consciencieux et parfaitement fidèle à son contenu, attestant de la qualité de votre lecture et du soin que vous apportez à résumer les ouvrages lus. »
>
> **Wiktor STOCZKOWSKI,**
> Maître de conférences à
> l'École des Hautes Études en Sciences Sociales (Paris).

<style>
:root {
--size-step-2
clamp(1.6875rem,1.36rem + 0.7vw,2.75rem) !important;
}
</style>`;

// Fonction pour extraire le front matter
function extractFrontMatter(content) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontMatterRegex);

    if (!match) {
        return { frontMatter: '', content: content };
    }

    return {
        frontMatter: `---\n${match[1]}\n---`,
        content: content.substring(match[0].length).trim()
    };
}

// Fonction pour extraire les commentaires
function extractComments(content) {
    // Supprimer la section style à la fin si elle existe
    const contentWithoutStyle = content.replace(/<style>[\s\S]*<\/style>$/i, '').trim();

    // Diviser en blocs de commentaires
    const commentBlocks = [];
    const lines = contentWithoutStyle.split('\n');
    let currentBlock = [];
    let inComment = false;

    for (const line of lines) {
        if (line.trim().startsWith('>')) {
            inComment = true;
            currentBlock.push(line);
        } else if (inComment && line.trim() === '') {
            // Ligne vide après un commentaire - garder pour séparer
            currentBlock.push(line);
            commentBlocks.push(currentBlock.join('\n'));
            currentBlock = [];
            inComment = false;
        } else if (inComment) {
            currentBlock.push(line);
        }
    }

    // Ajouter le dernier bloc s'il existe
    if (currentBlock.length > 0) {
        commentBlocks.push(currentBlock.join('\n'));
    }

    // Nettoyer les blocs vides
    return commentBlocks.filter(block => block.trim().length > 0);
}

// Fonction pour extraire le nom de l'auteur d'un commentaire
function extractAuthorName(commentBlock) {
    // Chercher la ligne avec **Nom,**
    const authorLineMatch = commentBlock.match(/\*\*([^*]*)\*\*/);
    if (authorLineMatch) {
        // Nettoyer le nom (enlever la virgule finale et les espaces)
        return authorLineMatch[1].replace(/,\s*$/, '').trim();
    }
    return 'Auteur inconnu';
}

// Fonction pour créer le front matter personnalisé
function createAuthorFrontMatter(originalFrontMatter, authorName) {
    // On garde les métadonnées originales mais on modifie le title
    const lines = originalFrontMatter.split('\n');
    let newFrontMatter = '';

    for (const line of lines) {
        if (line.trim().startsWith('title:')) {
            newFrontMatter += `title: "${authorName}"\n`;
        } else {
            newFrontMatter += line + '\n';
        }
    }

    return newFrontMatter;
}

// Fonction principale
function splitMarkdownFile() {
    const { frontMatter: originalFrontMatter, content } = extractFrontMatter(markdownContent);
    const commentBlocks = extractComments(content);

    if (commentBlocks.length === 0) {
        console.log('Aucun commentaire trouvé dans le fichier.');
        return;
    }

    // Créer un répertoire pour les fichiers de sortie
    const outputDir = 'commentaires_split';
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
    }

    // Créer un fichier pour chaque commentaire
    commentBlocks.forEach((commentBlock, index) => {
        const authorName = extractAuthorName(commentBlock);
        const fileName = join(outputDir, `${authorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.md`);

        // Créer le front matter personnalisé avec le nom de l'auteur
        const authorFrontMatter = createAuthorFrontMatter(originalFrontMatter, authorName);

        // Créer le contenu du fichier
        const fileContent = `${authorFrontMatter}\n\n${commentBlock.trim()}\n`;

        // Écrire le fichier
        writeFileSync(fileName, fileContent);
        console.log(`Fichier créé: ${fileName} (Titre: "${authorName}")`);
    });

    console.log(`\n${commentBlocks.length} fichiers ont été créés dans le répertoire "${outputDir}".`);
}

// Exécuter le script
splitMarkdownFile();
