const XLSX = require('xlsx');
const mongoose = require('mongoose');
const Task = require('./models/Tasks');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deindoctrinationApp',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Function to import Excel data
const importExcelData = async (filePath) => {
  try {
    console.log(`📖 Reading Excel file: ${filePath}`);
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 Found ${jsonData.length} rows in Excel file`);
    
    if (jsonData.length === 0) {
      console.log('❌ No data found in Excel file');
      return;
    }
    
    // Log the first row to see the structure
    console.log('📋 First row structure:', Object.keys(jsonData[0]));
    
    // Transform data to match our schema
    const tasks = jsonData.map((row, index) => {
      try {
        return {
          taskId: row['Task ID'] || row['TaskID'] || `TASK_${index + 1}`,
          taskName: row['Task Name'] || row['TaskName'] || '',
          taskCategory: row['Task Category'] || row['TaskCategory'] || 'General',
          taskDescription: row['Task Description'] || row['TaskDescription'] || '',
          taskCheck: row['Task Check'] || row['TaskCheck'] || '',
          taskVirtualReward: parseInt(row['Task Virtual Reward'] || row['TaskVirtualReward'] || 0),
          taskRealReward: row['Task Real Reward'] || row['TaskRealReward'] || '',
          // Map to legacy fields for backward compatibility
          title: row['Task Name'] || row['TaskName'] || '',
          category: row['Task Category'] || row['TaskCategory'] || 'General',
          description: row['Task Description'] || row['TaskDescription'] || '',
          rewardPoints: parseInt(row['Task Virtual Reward'] || row['TaskVirtualReward'] || 10),
          completed: false
        };
      } catch (error) {
        console.error(`❌ Error processing row ${index + 1}:`, error.message);
        return null;
      }
    }).filter(task => task !== null); // Remove null entries
    
    console.log(`✅ Processed ${tasks.length} valid tasks`);
    
    // Clear existing tasks (optional - comment out if you want to keep existing data)
    console.log('🗑️ Clearing existing tasks...');
    await Task.deleteMany({});
    
    // Insert new tasks
    console.log('💾 Inserting tasks into database...');
    const result = await Task.insertMany(tasks, { ordered: false });
    
    console.log(`✅ Successfully imported ${result.length} tasks!`);
    
    // Show sample of imported data
    console.log('\n📋 Sample imported tasks:');
    const sampleTasks = await Task.find().limit(3);
    sampleTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.taskName} (${task.taskCategory}) - ${task.taskVirtualReward} points`);
    });
    
  } catch (error) {
    console.error('❌ Error importing Excel data:', error.message);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    
    // Get file path from command line argument
    const filePath = process.argv[2];
    
    if (!filePath) {
      console.log('❌ Please provide the Excel file path as an argument');
      console.log('Usage: node importExcel.js path/to/your/file.xlsx');
      process.exit(1);
    }
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    
    await importExcelData(filePath);
    
    console.log('\n🎉 Import completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
};

// Handle different column name variations
const normalizeColumnNames = (data) => {
  return data.map(row => {
    const normalizedRow = {};
    
    Object.keys(row).forEach(key => {
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
      
      switch (normalizedKey) {
        case 'taskid':
          normalizedRow['Task ID'] = row[key];
          break;
        case 'taskname':
          normalizedRow['Task Name'] = row[key];
          break;
        case 'taskcategory':
          normalizedRow['Task Category'] = row[key];
          break;
        case 'taskdescription':
          normalizedRow['Task Description'] = row[key];
          break;
        case 'taskcheck':
          normalizedRow['Task Check'] = row[key];
          break;
        case 'taskvirtualreward':
          normalizedRow['Task Virtual Reward'] = row[key];
          break;
        case 'taskrealreward':
          normalizedRow['Task Real Reward'] = row[key];
          break;
        default:
          normalizedRow[key] = row[key];
      }
    });
    
    return normalizedRow;
  });
};

// Run the script
main();