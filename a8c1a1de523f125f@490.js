// https://observablehq.com/d/a8c1a1de523f125f@490
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["tswiftlyrics.csv",new URL("./files/d3fb7c83376fd1993553d60b443fa891582898909e6b67b8cc1c421080f604b7b6bf8660d73d91a5bbcb91fc7ade36485f98371b7bd1416fe54ec6384373010d",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Twitch Taylor Swift`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Below is data of Taylor Swift lyrics`
)});
  main.variable(observer()).define(["FileAttachment"], function(FileAttachment){return(
FileAttachment("tswiftlyrics.csv").text()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### Require d3`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require)
{
  const d3 = require("d3-dsv@1", "d3@5","d3-scale@3","d3-scale-chromatic@1", "d3-shape@1", "d3-array@2")
  return d3
}
);
  main.variable(observer("data")).define("data", ["FileAttachment","d3"], async function(FileAttachment,d3)
{
  const text = await FileAttachment("tswiftlyrics.csv").text();
  return d3.csvParse(text, ({lyric}) => ({
    lyric: lyric
  }));
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`#### Make a lyrics array of just the lyrics from the csv file`
)});
  main.variable(observer("lyrics")).define("lyrics", function(){return(
[]
)});
  main.variable(observer()).define(["data","lyrics"], function(data,lyrics){return(
data.forEach(lyric => lyrics.push(lyric.lyric))
)});
  main.variable(observer()).define(["lyrics"], function(lyrics){return(
lyrics
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### regex, convert to lower-case, clean up text`
)});
  main.variable(observer("newLyrics")).define("newLyrics", ["lyrics"], function(lyrics){return(
lyrics.join(' ').replace(/[.,\/#!""'$%\?^&\*;:{}=\-_`~()0-9]/g,"").toLowerCase()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### stop words`
)});
  main.variable(observer("stopwords")).define("stopwords", function(){return(
['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now', 'im', 'ill', 'let', 'said', 'thats', 'oh', 'say', 'see', 'yeah', 'youre', 'ey', 'cant', 'dont', 'cause']
)});
  main.variable(observer("remove_stopwords")).define("remove_stopwords", ["stopwords"], function(stopwords){return(
function(str) {
    var res = []
    var words = str.split(' ')
    for(let i=0;i<words.length;i++) {
       var word_clean = words[i].split(".").join("")
       if(!stopwords.includes(word_clean)) {
           res.push(word_clean)
       }
    }
    return(res.join(' '))
}
)});
  main.variable(observer("lyrics_no_stopwords")).define("lyrics_no_stopwords", ["remove_stopwords","newLyrics"], function(remove_stopwords,newLyrics){return(
remove_stopwords(newLyrics)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### Get string frequency for each lyric`
)});
  main.variable(observer("strFrequency")).define("strFrequency", function(){return(
function (stringArr) { //es6 way of getting frequencies of words
  return stringArr.reduce((count, word) => {
        count[word] = (count[word] || 0) + 1;
        return count;
  }, {})
}
)});
  main.variable(observer("obj")).define("obj", ["strFrequency","lyrics_no_stopwords"], function(strFrequency,lyrics_no_stopwords){return(
strFrequency(lyrics_no_stopwords.split(' '))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### function to return the first n items in the object`
)});
  main.variable(observer("firstN")).define("firstN", function(){return(
function firstN(obj, n) {
  return Object.keys(obj) //get the keys out
    .slice(0, n) //get the first N
    .reduce(function(memo, current) { //generate a new object out of them
      memo[current] = obj[current]
      return memo;
    }, [])
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### sort the frequencies to be max to min`
)});
  main.variable(observer("sortedObj")).define("sortedObj", ["obj"], function(obj){return(
Object.fromEntries(
                Object.entries(obj).sort( (a,b) => a[1] - b[1] )    
             )
)});
  main.variable(observer("obj_reverse")).define("obj_reverse", function(){return(
function obj_reverse(obj) {
  let new_obj= {}
  let rev_obj = Object.keys(obj).reverse();
  rev_obj.forEach(function(i) { 
    new_obj[i] = obj[i];
  })
  return new_obj;
}
)});
  main.variable(observer("newSortedObj")).define("newSortedObj", ["obj_reverse","sortedObj"], function(obj_reverse,sortedObj){return(
obj_reverse(sortedObj)
)});
  main.variable(observer("mostUsed")).define("mostUsed", ["firstN","newSortedObj"], function(firstN,newSortedObj){return(
firstN(newSortedObj, 30)
)});
  main.variable(observer("final")).define("final", ["mostUsed"], function(mostUsed){return(
Object.entries(mostUsed).map(([lyric, freq]) => ({lyric, freq}))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### set attributes of the chart/graph`
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 0, bottom: 30, left: 40}
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("x")).define("x", ["d3","final","margin","width"], function(d3,final,margin,width){return(
d3.scaleBand()
    .domain(final.map(d => d.lyric))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1)
)});
  main.variable(observer("y")).define("y", ["d3","final","height","margin"], function(d3,final,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(final, d => d.freq)])
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("yTitle")).define("yTitle", function(){return(
g => g.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("y", 10)
    .text("Frequency")
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x"], function(height,margin,d3,x){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(15))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("tooltip")).define("tooltip", ["d3"], function(d3){return(
d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("font-family", "'Open Sans', sans-serif")
      .style("font-size", "15px")
      .style("z-index", "10")
      .style("background-color", "#A7CDFA")
      .style("color", "#B380BA")
      .style("border", "solid")
      .style("border-color", "#A89ED6")
      .style("padding", "5px")
      .style("border-radius", "2px")
      .style("visibility", "hidden")
)});
  main.variable(observer()).define(["d3","width","height","tooltip","margin","y","final","x","xAxis","yTitle"], function(d3,width,height,tooltip,margin,y,final,x,xAxis,yTitle)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  // Call tooltip
  tooltip;

  svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
   const hoverBox = tooltip.append('rect')
      .attr('width', 10)
      .attr('height', 20)
      .attr('fill', "#FDE5BD")
      .style('opacity', 0.5)
   const textOffset = 25
  
  svg.append("g")
  .selectAll("rect")
  .data(final)
  .enter().append("rect")
    .attr('x', d => x(d.lyric))
    .attr('y', d => y(d.freq))
    .attr('width', x.bandwidth())
    .attr('height', d => y(0) - y(d.freq))
    .style("padding", "3px")
    .style("margin", "1px")
    .style("width", d => `${d * 10}px`)
    .text(d => d)
    .attr("fill", "#CEBEDE")
    .attr("stroke", "#FFB9EC")
    .attr("stroke-width", 1)
    .on("mouseover", function(d) {
      tooltip.style("visibility", "visible").text(d.lyric + ": " + d.freq);
      d3.select(this).attr("fill", "#FDE5BD");
    })
    .on("mousemove", d => tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text(d.lyric + ": " + d.freq))
    .on("mouseout", function(d) {
      tooltip.style("visibility", "hidden");
      d3.select(this)
    .attr("fill", "#CEBEDE")
    });
  
  svg.append("g")
      .call(xAxis);
  svg.call(yTitle);

  return svg.node();
}
);
  return main;
}
