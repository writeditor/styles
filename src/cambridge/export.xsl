<?xml version="1.0"?>
<!-- RASH (serialized head metadata) -> preamble and front matter for Cambridge's CUP-JNL-CHR class (the Computational Humanities Research
     template). The escaped body and abstract come from toLaTeX as parameters, so its sanitising stays in one place. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text"/>
<xsl:param name="abstract"/>
<xsl:param name="body"/>

<!-- Head values arrive already escaped for LaTeX (see venue.ts). -->
<xsl:template name="tex"><xsl:param name="s"/><xsl:value-of select="$s"/></xsl:template>

<!-- \macro{value}, only when the head has the value. -->
<xsl:template name="opt">
  <xsl:param name="macro"/>
  <xsl:param name="s"/>
  <xsl:if test="string-length(normalize-space($s)) &gt; 0">
    <xsl:text>\</xsl:text><xsl:value-of select="$macro"/><xsl:text>{</xsl:text><xsl:call-template name="tex"><xsl:with-param name="s" select="normalize-space($s)"/></xsl:call-template><xsl:text>}
</xsl:text>
  </xsl:if>
</xsl:template>

<xsl:template match="/html">
  <xsl:variable name="meta" select="head/meta"/>
  <xsl:variable name="journal" select="$meta[@property = 'writ:cambridge.journal']/@content"/>
  <xsl:variable name="creators" select="$meta[@name = 'dc.creator']"/>
  <xsl:variable name="year" select="substring($meta[@property = 'dcterms:issued']/@content, 1, 4)"/>
  <xsl:text>\documentclass[twocolumn]{CUP-JNL-CHR}
\usepackage{graphicx}
\usepackage{multicol,multirow}
\usepackage{amsmath,amssymb,amsfonts}
\usepackage{rotating}
\usepackage{appendix}
\usepackage[sort&amp;compress]{natbib}
\usepackage[colorlinks,allcolors=blue]{hyperref}
\usepackage{breakurl}

</xsl:text>
  <xsl:call-template name="opt"><xsl:with-param name="macro" select="'articletype'"/><xsl:with-param name="s" select="$meta[@property = 'dcterms:type']/@content"/></xsl:call-template>
  <xsl:text>\jname{</xsl:text>
  <xsl:choose>
    <xsl:when test="$journal = 'pri'">Cambridge Prisms</xsl:when>
    <xsl:when test="$journal = 'rdi'">Research Directions</xsl:when>
    <xsl:when test="$journal = 'large'">Cambridge Large One</xsl:when>
    <xsl:otherwise>Computational Humanities Research</xsl:otherwise>
  </xsl:choose>
  <xsl:text>}
</xsl:text>
  <xsl:if test="string-length($year) = 4 and number($year) = number($year)"><xsl:text>\jyear{</xsl:text><xsl:value-of select="$year"/><xsl:text>}
</xsl:text></xsl:if>
  <xsl:call-template name="opt"><xsl:with-param name="macro" select="'jdoi'"/><xsl:with-param name="s" select="$meta[@property = 'prism:doi']/@content"/></xsl:call-template>
  <xsl:call-template name="opt"><xsl:with-param name="macro" select="'copyrightline'"/><xsl:with-param name="s" select="$meta[@property = 'writ:cambridge.copyright']/@content"/></xsl:call-template>
  <xsl:text>
\begin{document}

\begin{Frontmatter}

</xsl:text>
  <xsl:call-template name="opt"><xsl:with-param name="macro" select="'title'"/><xsl:with-param name="s" select="head/title"/></xsl:call-template>
  <xsl:text>
</xsl:text>
  <xsl:for-each select="$creators">
    <xsl:variable name="who" select="@about"/>
    <xsl:text>\author</xsl:text>
    <xsl:if test="$meta[@about = $who][@property = 'schema:contactPoint']">*</xsl:if>
    <xsl:text>[</xsl:text>
    <!-- Affiliations are numbered in the order the head lists them. -->
    <xsl:for-each select="../link[@about = $who][@property = 'schema:affiliation']">
      <xsl:variable name="org" select="@href"/>
      <xsl:if test="position() &gt; 1">,</xsl:if>
      <xsl:value-of select="count($meta[@about = $org]/preceding-sibling::meta[@typeof = 'schema:Organization']) + 1"/>
    </xsl:for-each>
    <xsl:text>]{</xsl:text><xsl:call-template name="tex"><xsl:with-param name="s" select="@content"/></xsl:call-template><xsl:text>}
</xsl:text>
  </xsl:for-each>
  <xsl:if test="$creators">
    <!-- Running head: the first author, "et al." from three authors on. -->
    <xsl:text>
\authormark{</xsl:text><xsl:call-template name="tex"><xsl:with-param name="s" select="$creators[1]/@content"/></xsl:call-template>
    <xsl:choose>
      <xsl:when test="count($creators) = 2"><xsl:text> and </xsl:text><xsl:call-template name="tex"><xsl:with-param name="s" select="$creators[2]/@content"/></xsl:call-template></xsl:when>
      <xsl:when test="count($creators) &gt; 2"><xsl:text> et al.</xsl:text></xsl:when>
    </xsl:choose>
    <xsl:text>}

</xsl:text>
  </xsl:if>
  <xsl:for-each select="$meta[@typeof = 'schema:Organization']">
    <xsl:text>\address[</xsl:text><xsl:value-of select="position()"/><xsl:text>]{</xsl:text>
    <xsl:call-template name="tex"><xsl:with-param name="s" select="normalize-space(@content)"/></xsl:call-template><xsl:text>}

</xsl:text>
  </xsl:for-each>
  <xsl:variable name="email" select="$meta[@property = 'schema:email'][@about = $meta[@property = 'schema:contactPoint']/@about][1]/@content"/>
  <xsl:if test="$email">\corresp{\email{<xsl:call-template name="tex"><xsl:with-param name="s" select="$email"/></xsl:call-template>}}
</xsl:if>
  <xsl:call-template name="opt"><xsl:with-param name="macro" select="'citethisarticle'"/><xsl:with-param name="s" select="$meta[@property = 'writ:cambridge.cite']/@content"/></xsl:call-template>
  <xsl:call-template name="opt"><xsl:with-param name="macro" select="'received'"/><xsl:with-param name="s" select="$meta[@property = 'writ:cambridge.received']/@content"/></xsl:call-template>
  <xsl:call-template name="opt"><xsl:with-param name="macro" select="'revised'"/><xsl:with-param name="s" select="$meta[@property = 'writ:cambridge.revised']/@content"/></xsl:call-template>
  <xsl:call-template name="opt"><xsl:with-param name="macro" select="'accepted'"/><xsl:with-param name="s" select="$meta[@property = 'writ:cambridge.accepted']/@content"/></xsl:call-template>
  <xsl:if test="string-length($abstract) &gt; 0">
\abstract{<xsl:value-of select="$abstract"/>}
</xsl:if>
  <xsl:if test="$meta[@property = 'prism:keyword']">
\keywords{<xsl:for-each select="$meta[@property = 'prism:keyword']"><xsl:if test="position() &gt; 1">; </xsl:if><xsl:call-template name="tex"><xsl:with-param name="s" select="@content"/></xsl:call-template></xsl:for-each>}
</xsl:if>
  <xsl:text>
\end{Frontmatter}

</xsl:text>
  <xsl:value-of select="$body"/><xsl:text>\end{document}
</xsl:text>
</xsl:template>
</xsl:stylesheet>
