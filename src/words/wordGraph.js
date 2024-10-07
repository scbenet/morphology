// wordGraph.js
export function buildWordGraph(words) {
    const graph = new Map();
    
    function areWordsConnected(word1, word2) {
      let differences = 0;
      for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) differences++;
      }
      return differences === 1;
    }
  
    // Build adjacency list
    for (let i = 0; i < words.length; i++) {
      const word1 = words[i];
      if (!graph.has(word1)) graph.set(word1, new Set());
      
      for (let j = i + 1; j < words.length; j++) {
        const word2 = words[j];
        if (areWordsConnected(word1, word2)) {
          graph.get(word1).add(word2);
          if (!graph.has(word2)) graph.set(word2, new Set());
          graph.get(word2).add(word1);
        }
      }
    }
  
    return graph;
  }
  
  // Find all connected components
  export function findConnectedComponents(graph) {
    const visited = new Set();
    const components = [];
  
    function dfs(word, component) {
      visited.add(word);
      component.add(word);
      
      for (const neighbor of graph.get(word)) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, component);
        }
      }
    }
  
    for (const word of graph.keys()) {
      if (!visited.has(word)) {
        const component = new Set();
        dfs(word, component);
        components.push(Array.from(component));
      }
    }
  
    return components;
  }