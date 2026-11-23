<?xml version="1.0"?>
<!-- RASH head -> preamble and front matter for Oxford University Press's oup-authoring-template class. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text"/>
<xsl:param name="abstract"/>
<xsl:param name="body"/>

<xsl:template match="/html">
  <xsl:variable name="meta" select="head/meta"/>
  <xsl:variable name="creators" select="$meta[@name = 'dc.creator']"/>
  <xsl:text>\documentclass[unnumsec,webpdf,contemporary,large]{oup-authoring-template}
\begin{document}
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
    <xsl:text>]{</xsl:text><xsl:value-of select="@content"/><xsl:text>}
</xsl:text>
  </xsl:for-each>
  <xsl:for-each select="$meta[@typeof = 'schema:Organization']">
    <xsl:text>\address[</xsl:text><xsl:value-of select="position()"/><xsl:text>]{\orgname{</xsl:text><xsl:value-of select="normalize-space(@content)"/><xsl:text>}}
</xsl:text>
  </xsl:for-each>
  <xsl:text>
\abstract{</xsl:text><xsl:value-of select="$abstract"/><xsl:text>}
</xsl:text>
  <xsl:if test="$meta[@property = 'prism:keyword']">\keywords{<xsl:for-each select="$meta[@property = 'prism:keyword']"><xsl:if test="position() &gt; 1">, </xsl:if><xsl:value-of select="@content"/></xsl:for-each>}
</xsl:if>
  <xsl:text>
\maketitle

</xsl:text><xsl:value-of select="$body"/><xsl:text>\end{document}
</xsl:text>
</xsl:template>
</xsl:stylesheet>
