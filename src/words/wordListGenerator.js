// wordListGenerator.js
// import commonWords from './commonWords.json'; // Could be from various sources
import { wordList } from "./wordList.js";
import { buildWordGraph, findConnectedComponents } from "./wordGraph.js";

export function generateGameWordList() {
  // Filter for common, playable words
  const candidates = wordList.filter(word => 
    word.length === 5 && // Or whatever length you want
    /^[a-z]+$/.test(word) && // Only letters
    !word.endsWith('s') // Optional: avoid plurals
  );

  // Build graph and find connected components
  const graph = buildWordGraph(candidates);
  const components = findConnectedComponents(graph);

  // Find the largest component
  const largestComponent = components.reduce((max, curr) => 
    curr.length > max.length ? curr : max
  , []);

  return {
    words: largestComponent,
    graph: new Map([...graph].filter(([key]) => largestComponent.includes(key)))
  };
}

// Generate pairs that are actually solvable
export function generateWordPair(words, graph, minSteps = 2, maxSteps = 5) {
  function findPath(start, end, maxDepth) {
    if (maxDepth === 0) return null;

    const visited = new Set([start]);
    const queue = [[start, [start]]];

    while (queue.length > 0) {
      const [current, path] = queue.shift();

      if (current === end) return path;

      // Stop exploring if we've reached the maximum allowed depth
      if (path.length - 1 >= maxDepth) continue;

      for (const neighbor of graph.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }

    return null;
  }

  while (true) {
    const start = words[Math.floor(Math.random() * words.length)];
    const end = words[Math.floor(Math.random() * words.length)];
    
    const path = findPath(start, end, maxSteps);
    if (path && path.length >= minSteps && path.length <= maxSteps + 1) {
      return {
        startWord: start,
        targetWord: end,
        sampleSolution: path
      };
    }
  }
}