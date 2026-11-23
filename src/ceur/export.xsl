<?xml version="1.0"?>
<!-- RASH head -> preamble and front matter for CEUR-WS's ceurart class. Body and abstract come from toLaTeX as parameters. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text"/>
<xsl:param name="abstract"/>
<xsl:param name="body"/>

<xsl:template match="/html">
  <xsl:variable name="meta" select="head/meta"/>
  <xsl:variable name="creators" select="$meta[@name = 'dc.creator']"/>
  <xsl:text>\documentclass{ceurart}
\usepackage{listings}
\begin{document}
\copyrightclause{Copyright for this paper by its authors. Use permitted under Creative Commons License Attribution 4.0 International (CC BY 4.0).}
\conference{</xsl:text><xsl:value-of select="$meta[@property = 'writ:ceur.conference']/@content"/><xsl:text>}
\title{</xsl:text><xsl:value-of select="normalize-space(head/title)"/><xsl:text>}

</xsl:text>
  <xsl:for-each select="$creators">
    <xsl:variable name="who" select="@about"/>
    <xsl:text>\author[</xsl:text>
    <xsl:for-each select="../link[@about = $who][@property = 'schema:affiliation']">
      <xsl:variable name="org" select="@href"/>
      <xsl:if test="position() &gt; 1">,</xsl:if>
      <xsl:value-of select="count($meta[@about = $org]/preceding-sibling::meta[@typeof = 'schema:Organization']) + 1"/>
    </xsl:for-each>
    <xsl:text>]{</xsl:text><xsl:value-of select="@content"/><xsl:text>}</xsl:text>
    <xsl:variable name="orcid" select="$meta[@about = $who][@property = 'schema:identifier' or @property = 'orcid'][1]/@content"/>
    <xsl:variable name="email" select="$meta[@about = $who][@property = 'schema:email'][1]/@content"/>
    <xsl:if test="$orcid or $email">[<xsl:if test="$orcid">orcid=<xsl:value-of select="$orcid"/>,</xsl:if><xsl:if test="$email">email=<xsl:value-of select="$email"/>,</xsl:if>]</xsl:if>
    <xsl:text>
</xsl:text>
  </xsl:for-each>
  <xsl:for-each select="$meta[@typeof = 'schema:Organization']">
    <xsl:text>\address[</xsl:text><xsl:value-of select="position()"/><xsl:text>]{</xsl:text><xsl:value-of select="normalize-space(@content)"/><xsl:text>}
</xsl:text>
  </xsl:for-each>
  <xsl:text>
\begin{abstract}
</xsl:text><xsl:value-of select="$abstract"/><xsl:text>
\end{abstract}
</xsl:text>
  <xsl:if test="$meta[@property = 'prism:keyword']">\begin{keywords}
<xsl:for-each select="$meta[@property = 'prism:keyword']"><xsl:if test="position() &gt; 1"> \sep </xsl:if><xsl:value-of select="@content"/></xsl:for-each>
\end{keywords}
</xsl:if>
  <xsl:text>
\maketitle

</xsl:text><xsl:value-of select="$body"/><xsl:text>\end{document}
</xsl:text>
</xsl:template>
</xsl:stylesheet>
