import { PipelineContext, AgentResult, FileOperation } from '../types';
import { PlannerAgent } from '../agents/PlannerAgent';
import { CodeGeneratorAgent } from '../agents/CodeGeneratorAgent';
import { vfs } from '../vfs/VirtualFileSystem';
import Execution from '../models/Execution';
import mongoose from 'mongoose';

export class PipelineOrchestrator {
  private agents = {
    planner: new PlannerAgent(),
    codeGenerator: new CodeGeneratorAgent(),
  };

  async executePipeline(
    projectId: string,
    userId: string,
    prompt: string,
    providerId?: string,
    model?: string,
    onProgress?: (message: string) => void
  ): Promise<AgentResult[]> {
    const context: PipelineContext = {
      projectId,
      userId,
      prompt,
      files: await vfs.loadProject(projectId),
      history: [],
      providerId,
      model,
    };

    const results: AgentResult[] = [];

    try {
      // Send initial status
      onProgress?.('📦 Initializing project workspace...');
      
      // Planning phase
      onProgress?.('🎯 Planning project architecture...');
      onProgress?.('📝 Analyzing requirements and creating blueprint...');
      
      const planResult = await this.executeAgent('planner', context);
      results.push(planResult);
      context.history.push(planResult);

      if (!planResult.success) {
        throw new Error('Planning failed');
      }

      onProgress?.('✅ Planning phase completed!');
      
      // Extract plan details for display
      const plan = planResult.output;
      if (plan) {
        if (plan.projectType) {
          onProgress?.(`🏛️ Project type: ${plan.projectType}`);
        }
        if (plan.stack && Array.isArray(plan.stack)) {
          onProgress?.(`🛠️ Tech stack: ${plan.stack.join(', ')}`);
        }
        if (plan.files && Array.isArray(plan.files)) {
          onProgress?.(`📄 Files to generate: ${plan.files.length}`);
        }
      }

      // Code generation phase
      onProgress?.('');
      onProgress?.('⚡ Starting code generation...');
      
      const codeResult = await this.executeAgent('codeGenerator', context, onProgress);
      results.push(codeResult);
      context.history.push(codeResult);

      if (codeResult.success && codeResult.fileOperations) {
        onProgress?.('');
        onProgress?.('💾 Saving generated files to workspace...');
        
        await this.applyFileOperations(projectId, codeResult.fileOperations, onProgress);
        
        onProgress?.('✅ All files saved successfully!');
      }

      onProgress?.('');
      onProgress?.('🎉 Build pipeline completed successfully!');
      onProgress?.('🚀 Your project is ready to preview!');

      return results;
    } catch (error: any) {
      onProgress?.(`❌ Pipeline failed: ${error.message}`);
      throw error;
    }
  }

  private async executeAgent(
    agentName: keyof typeof this.agents,
    context: PipelineContext,
    onProgress?: (message: string) => void
  ): Promise<AgentResult> {
    const agent = this.agents[agentName];
    
    const execution = await Execution.create({
      projectId: new mongoose.Types.ObjectId(context.projectId),
      userId: new mongoose.Types.ObjectId(context.userId),
      agentType: agent.name,
      status: 'running',
      input: { prompt: context.prompt },
      startedAt: new Date(),
    });

    try {
      // Pass onProgress to agents that support it
      const result = await agent.execute(context, onProgress);

      await Execution.findByIdAndUpdate(execution._id, {
        status: result.success ? 'completed' : 'failed',
        output: result.output,
        logs: result.logs.map(msg => ({
          timestamp: new Date(),
          level: 'info',
          message: msg,
        })),
        completedAt: new Date(),
      });

      return result;
    } catch (error: any) {
      await Execution.findByIdAndUpdate(execution._id, {
        status: 'failed',
        logs: [{
          timestamp: new Date(),
          level: 'error',
          message: error.message,
        }],
        completedAt: new Date(),
      });

      throw error;
    }
  }

  private async applyFileOperations(
    projectId: string,
    operations: FileOperation[],
    onProgress?: (message: string) => void
  ): Promise<void> {
    for (const op of operations) {
      switch (op.type) {
        case 'create':
        case 'update':
          if (op.content) {
            onProgress?.(`  📄 Saving ${op.path}...`);
            await vfs.updateFile(projectId, op.path, op.content, op.diff);
          }
          break;
        case 'delete':
          onProgress?.(`  🗑️ Deleting ${op.path}...`);
          await vfs.deleteFile(projectId, op.path);
          break;
      }
    }
  }
}

export const pipelineOrchestrator = new PipelineOrchestrator();
