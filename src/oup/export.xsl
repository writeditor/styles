<?xml version="1.0"?>
<!-- RASH head -> preamble and front matter for Oxford University Press's oup-authoring-template class.
     The journal data (writ:oup.*, see eval/tex2rash.ts "metaCommands") is optional: a Writ paper has none, the sample has all of it. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text"/>
<xsl:param name="abstract"/>
<xsl:param name="body"/>

<xsl:template match="/html">
  <xsl:variable name="meta" select="head/meta"/>
  <xsl:variable name="creators" select="$meta[@name = 'dc.creator']"/>
  <xsl:text>\documentclass[unnumsec,webpdf,contemporary,large]{oup-authoring-template}
\newcommand{\societylogo}{}
\providecommand{\appendix}{\appendixtitleoff}
\begin{document}
</xsl:text>
  <xsl:for-each select="$meta[starts-with(@property, 'writ:oup.')][contains('|journal|DOI|year|pubyear|vol|issue|access|appnotes|firstpage|', concat('|', substring-after(@property, 'writ:oup.'), '|'))]">
    <xsl:variable name="cmd" select="substring-after(@property, 'writ:oup.')"/>
    <xsl:text>\</xsl:text><xsl:choose><xsl:when test="$cmd = 'journal'">journaltitle</xsl:when><xsl:when test="$cmd = 'year'">copyrightyear</xsl:when><xsl:otherwise><xsl:value-of select="$cmd"/></xsl:otherwise></xsl:choose><xsl:text>{</xsl:text><xsl:value-of select="@content"/><xsl:text>}
</xsl:text>
  </xsl:for-each>
  <xsl:variable name="title" select="normalize-space(head/title)"/>
  <xsl:text>
\title[</xsl:text><xsl:value-of select="$title"/><xsl:text>]{</xsl:text><xsl:value-of select="$title"/><xsl:text>}

</xsl:text>
  <xsl:for-each select="$creators">
    <xsl:variable name="who" select="@about"/>
    <xsl:text>\author[</xsl:text>
    <xsl:for-each select="../link[@about = $who][@property = 'schema:affiliation']">
      <xsl:variable name="org" select="@href"/>
      <xsl:if test="position() &gt; 1">,</xsl:if>
      <xsl:value-of select="count($meta[@about = $org]/preceding-sibling::meta[@typeof = 'schema:Organization']) + 1"/>
    </xsl:for-each>
    <xsl:if test="../meta[@about = $who][@property = 'writ:oup.marks']">,$\ast$</xsl:if>
    <xsl:text>]{</xsl:text><xsl:value-of select="@content"/>
    <xsl:if test="../link[@about = $who][@property = 'schema:sameAs'][contains(@href, 'orcid.org/')]">\ORCID{<xsl:value-of select="substring-after(../link[@about = $who][@property = 'schema:sameAs'][contains(@href, 'orcid.org/')]/@href, 'orcid.org/')"/>}</xsl:if>
    <xsl:text>}
</xsl:text>
  </xsl:for-each>
  <xsl:for-each select="$meta[@typeof = 'schema:Organization']">
    <xsl:text>\address[</xsl:text><xsl:value-of select="position()"/><xsl:text>]{\orgname{</xsl:text><xsl:value-of select="normalize-space(@content)"/><xsl:text>}}
</xsl:text>
  </xsl:for-each>
  <xsl:for-each select="$meta[@property = 'writ:oup.corresp']">\corresp[$\ast$]{<xsl:value-of select="substring-after(@content, '|')"/>}
</xsl:for-each>
  <xsl:for-each select="$meta[@property = 'writ:oup.received' or @property = 'writ:oup.revised' or @property = 'writ:oup.accepted']">
    <xsl:variable name="v" select="concat(@content, '||')"/>
    <xsl:text>\</xsl:text><xsl:value-of select="substring-after(@property, 'writ:oup.')"/><xsl:text>{</xsl:text><xsl:value-of select="substring-before($v, '|')"/><xsl:text>}{</xsl:text><xsl:value-of select="substring-before(substring-after($v, '|'), '|')"/><xsl:text>}{</xsl:text><xsl:value-of select="substring-before(substring-after(substring-after($v, '|'), '|'), '|')"/><xsl:text>}
</xsl:text>
  </xsl:for-each>
  <xsl:text>
\abstract{</xsl:text><xsl:value-of select="$abstract"/><xsl:text>}
</xsl:text>
  <xsl:if test="$meta[@property = 'prism:keyword']">\keywords{<xsl:for-each select="$meta[@property = 'prism:keyword']"><xsl:if test="position() &gt; 1">, </xsl:if><xsl:value-of select="@content"/></xsl:for-each>}
</xsl:if>
  <xsl:for-each select="$meta[@property = 'writ:oup.keywords-abbreviations']">\keywords[Abbreviations]{<xsl:value-of select="@content"/>}
</xsl:for-each>
  <xsl:for-each select="$meta[@property = 'writ:oup.otherabstract']">\otherabstract[<xsl:value-of select="substring-before(@content, '|')"/>]{<xsl:value-of select="substring-after(@content, '|')"/>}
</xsl:for-each>
  <xsl:for-each select="$meta[@property = 'writ:oup.boxedtext']">\boxedtext{<xsl:value-of select="substring-before(@content, '|')"/>}{<xsl:value-of select="substring-after(@content, '|')"/>}
</xsl:for-each>
  <xsl:text>
\maketitle

</xsl:text><xsl:value-of select="$body"/><xsl:text>\end{document}
</xsl:text>
</xsl:template>
</xsl:stylesheet>
