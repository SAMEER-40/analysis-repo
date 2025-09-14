// Fix: Implement the full geminiService module to handle API calls to Google Gemini.
import { GoogleGenAI } from "@google/genai";
import { TreeNodeData } from "../types";

// Initialize the Google AI client.
// An API key must be available in the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Creates a simplified string representation of the project's directory structure.
 * This provides context to the AI about the file's location and surroundings.
 * @param tree - The root of the file tree.
 * @param selectedNodePath - The path of the currently selected file or folder.
 * @param maxDepth - The maximum depth to traverse.
 * @param maxChildren - The maximum number of children to show per folder.
 * @returns A string representing the file tree.
 */
function stringifyTree(
    tree: TreeNodeData,
    selectedNodePath: string,
    maxDepth = 10,
    maxChildren = 20
): string {
    let treeString = '';
    function buildString(node: TreeNodeData, prefix = '', depth = 0) {
        if (depth > maxDepth) return;

        const isSelected = node.path === selectedNodePath;
        // Highlight the selected node for the AI's attention.
        const marker = isSelected ? '>> ' : '';
        treeString += `${prefix}${marker}${node.name}\n`;

        if (node.children) {
            const childrenToShow = node.children.slice(0, maxChildren);
            childrenToShow.forEach((child, index) => {
                const isLast = index === childrenToShow.length - 1;
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                buildString(child, newPrefix, depth + 1);
            });
            if (node.children.length > maxChildren) {
                treeString += `${prefix}│   ...and ${node.children.length - maxChildren} more\n`;
            }
        }
    }
    buildString(tree);
    return treeString;
}


/**
 * Generates an explanation for a folder using the Gemini API.
 * @param folderNode - The tree node data for the folder.
 * @returns A promise that resolves to a string explanation.
 */
export const explainFolder = async (folderNode: TreeNodeData): Promise<string> => {
    const childrenNames = folderNode.children?.map(child => child.name).join(', ') || 'This folder is empty.';
    const prompt = `
        You are an expert software architect. Provide a high-level explanation for the following folder.
        
        Folder Path: ${folderNode.path}
        Folder Contents: ${childrenNames}

        Based on its name and the files/folders it contains, what is the primary purpose of this folder? 
        Describe its role within a typical project structure. Keep the explanation concise and clear.
        Use markdown for formatting.
    `;

    try {
        // Correctly call the Gemini API to generate content.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        // Correctly extract the text from the response.
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get explanation from the AI. Please check your API key and network connection.");
    }
};

/**
 * Generates an explanation for a file using the Gemini API, including context from the project structure.
 * @param fileNode - The tree node data for the file, including its content.
 * @param fullTree - The entire project file tree for context.
 * @returns A promise that resolves to a string explanation.
 */
export const explainFile = async (fileNode: TreeNodeData, fullTree: TreeNodeData | null): Promise<string> => {
    if (fileNode.content === '[Binary File]') {
        return Promise.resolve(`
### Binary File: ${fileNode.name}

This file has been identified as a binary file and its contents cannot be displayed or analyzed. 
Binary files are typically compiled code, images, or other non-text formats.
        `);
    }

    const projectStructure = fullTree ? stringifyTree(fullTree, fileNode.path) : 'Project structure not available.';
    
    const prompt = `
        You are an expert Principal Software Architect, renowned for your ability to understand complex codebases at a glance. Your task is to analyze a single file within the context of its entire project. Your analysis must be deep, relational, and architectural. Do not simply describe the code; explain its purpose and connections.

        **CONTEXT: Full Project File Structure**
        A text representation of the project is provided below. The '>>' marker indicates the file currently under review. Use this tree to understand the file's location, its neighbors, and the overall project layout.

        \`\`\`
        ${projectStructure}
        \`\`\`

        **SUBJECT: File for Analysis**
        - **Path:** \`${fileNode.path}\`
        - **Source Code:**
        \`\`\`
        ${fileNode.content || '// This file is empty.'}
        \`\`\`

        ---

        **YOUR MANDATE: Provide a Multi-faceted Analysis (Use Markdown)**

        Your response MUST follow this structure precisely:

        ### 1. Executive Summary
        A concise, one-sentence summary of this file's primary responsibility.

        ### 2. Architectural Significance
        This is the most critical part of your analysis. Explain how this file fits into the project's architecture.
        - **Role & Pattern:** What is the file's architectural role (e.g., UI View Component, Business Logic Service, Data Model, Configuration, Utility)? Does it implement a specific design pattern (e.g., Singleton, Factory, Middleware)?
        - **Dependencies & Collaborators:**
            - Based on its code and the file tree, what are its primary **incoming dependencies** (i.e., other files it imports/requires)?
            - Who are its primary **collaborators** or **consumers** (i.e., what other files likely import and use this one)? Refer to specific paths from the file tree.
        - **Data Flow:** How does data flow into and out of this file? Does it receive props, call APIs, dispatch actions, or query a database? Explain its position in the application's overall data flow.
        - **Justification for Location:** Explain why this file is located at \`${fileNode.path}\`. How does its placement reflect its role?

        ### 3. Core Logic Breakdown
        Briefly describe the purpose of the main functions, classes, or components within the file. Focus on the "what" and "why," not just re-stating the code.

        ### 4. Visual Dependency Map (Mermaid)
        Generate a MermaidJS \`graph TD\` diagram illustrating this file's key relationships.
        - The diagram should focus on the most important interactions (e.g., \`App.tsx --> Home.tsx\`, \`Home.tsx --> fileTreeService.ts\`).
        - **CRITICAL SYNTAX RULES:**
            - Use simple, alphanumeric node IDs (e.g., \`App\`, \`Home\`, \`FileTreeService\`).
            - Node labels MUST be quoted strings containing the file path (e.g., \`App["/components/App.tsx"]\`).
            - Edge labels (text on arrows) MUST be a single, concise, quoted string. Example: \`A -- "sends data to" --> B\`. Do NOT use commas or multiple labels on a single edge.
            - If a diagram is not relevant for this file (e.g., a simple config file), write "No diagram needed for this file." instead of a mermaid block.
        - Enclose the final diagram in a \`\`\`mermaid\`\`\` code block.
    `;

    try {
        // Correctly call the Gemini API to generate content.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        // Correctly extract the text from the response.
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get explanation from the AI. Please check your API key and network connection.");
    }
};