import sqlite3
from sqlite3 import Error

PEOPLE = 1
MEMORIES = 2
PEOPLE_MEMORIES = 3
PERSONAL_MEMORIES = 4


def create_connection(db_file):
    """
    create a database connection to the SQLite database
    :param db_file: database file
    :return: Connection object or None
    """
    try:
        connection = sqlite3.connect(db_file)
        return connection
    except Error as e:
        print(e)
    return None

def create_table(conn, create_table_sql):
    """ creates a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def select_all_personal_memories(connection):
    """
    Gets all the data from the personalMemory2 Database. It prints the data and returns the data
    :param connection: Connection object
    :return: the data extracted
    """
    cur = connection.cursor()
    cur.execute("SELECT * FROM personalMemory2")
    rows = cur.fetchall()
    for row in rows:
        print(row)
    return rows


def select_all_people(connection):
    """
    Gets all the data from the people table. It prints and returns the data
    :param connection: Connection object
    :return: the data extracted
    """

    cur = connection.cursor()
    cur.execute("SELECT * FROM people")
    rows = cur.fetchall()
    for row in rows:
        print(row)
    return rows

def select_all_memories(connection):
    """
    Gets all the data from the memory table. It prints and returns the data.
    :param connection: Connection object
    :return: the data extracted
    """
    cur = connection.cursor()
    cur.execute("SELECT * FROM memory")
    rows = cur.fetchall()
    for row in rows:
        print(row)
    return rows

def select_all_people_memories(connection):
    """
    Gets all the data from the memory_people table. It prints and returns the data.
    :param connection: Connection object
    :return: the data extracted
    """
    cur = connection.cursor()
    cur.execute("SELECT * FROM memory_people")
    rows = cur.fetchall()
    for row in rows:
        print(row)
    return rows


def select_certain_date(connection, date):
    """
    Queries the memory table by the date in which the memory was taken. It prints and returns the data.
    :param connection: Connection object
    :param date: the date being searched for
    :return: the data extracted
    """
    cur = connection.cursor()
    sql = 'SELECT memory_file FROM memory WHERE date_taken LIKE ?'
    cur.execute(sql, ('%' + date + '%',))
    row = cur.fetchall()
    for x in row:
        print(x)
    return row


def select_memory_person(connection, person):
    """
    Queries the memory table for a given person and returns the memory file names
    :param connection: Connection object
    :param person: the person for whom the memory will be searched for
    :return: a list of file names in which the person is present
    """
    cur = connection.cursor()
    sql = 'SELECT id FROM people WHERE first_name = ?'
    cur.execute(sql, (person,))
    person_id = cur.fetchone()
    sql = 'SELECT memory_id FROM memory_people WHERE people_id = ?'
    cur.execute(sql, person_id)
    rows = cur.fetchall()
    sql = 'SELECT memory_file FROM memory WHERE id = ?'
    personal_memories = []
    for x in rows:
        cur.execute(sql, x)
        personal_memories.append(cur.fetchone()[0])
    return personal_memories


def person_exists(connection, people):
    """
    Returns True if the person exists otherwise it returns False
    :param connection: Connection Object
    :param people: a person's name
    :return: List of length 2.
    For list A:
        A[0]: True if the person exists, False otherwise
        A[1]: The person ID if the person exists. Otherwise None.
    """
    sql = 'SELECT id FROM people WHERE first_name=?'
    cur = connection.cursor()
    cur.execute(sql, (people,))
    person = cur.fetchone()
    if person:
        return [True,person[0]]
    else:
        return [False,person]

def create_memory(connection, date_taken, memory_file):
    """

    :param connection: Connection Object
    :param date_taken: the date when the memory was captured
    :param memory_file: the name of the memory file
    :return: the last id in the memory table
    """

    sql = '''INSERT INTO memory(date_taken, memory_file)
              VALUES(?,?)'''
    cur = connection.cursor()
    cur.execute(sql, (date_taken, memory_file))
    return cur.lastrowid

def create_personal_memory(connection, data):
    """
    Populates the personalMemory2 table
    :param connection: Connection Object
    :param data: data being inserted into the personalMemory2 table. person,memory_file,caption
    :return: True once successfully completed insertion
    """
    sql = ''' INSERT INTO personalMemory2(person,memory_file,caption)
            VALUES(?,?,?)'''
    cur = connection.cursor()
    cur.execute(sql, data)
    return True

def create_people(connection,people):
    """
    :param connection: Connection Object
    :param people: List of people names
    :return: List of people ids
    """
    people_ids = []
    cur = connection.cursor()
    if people:
        for person in people:
            result = person_exists(connection, person)
            if result[0]:
                people_ids.append(result[1])
            else:
                sql = '''INSERT INTO people(first_name)
                          VALUES(?)'''
                cur.execute(sql, (person,))
                people_ids.append(cur.lastrowid)
        return people_ids
    else:
        return None

def create_memory_people(connection,memory_id,people_ids):
    """
    Populates the memory_people table
    :param connection: Connection Object
    :param memory_id: the memory primary key
    :param people_ids: the people primary key
    :return: The id of the last row in the memory_people table
    """
    cur = connection.cursor()

    sql = '''INSERT INTO memory_people(memory_id, people_id)
              VALUES(?,?)'''
    #creates the connections
    for person_id in people_ids:
        cur.execute(sql, (memory_id, person_id,))
    return cur.lastrowid


def getData(file):
    """
    Extracts data from text file.
    Format of each line in text file: file_name,date_taken,[person1_name,person2_name]
    Example: 2_second.mp4,2015-11-23,[adin,ian]
    :param file: the text file being parsed
    :return: A list with data used to populate the memory table and people table.
    """
    data = []
    for x in file:
        test = x.split(',', 2)
        video_title = test[0]
        date_taken = test[1]
        people = test[2].split('[')[1].split(']')[0]
        if people.lower() == 'none' or not people:
            people = None
        else:
            people = people.split(',')
        data.append({'video_title': video_title, 'date_taken': date_taken, 'people': people})
    return data

# Gets the Data from personal memories file
def getPersonalMemoriesData(file):
    """
    Parses a file and extracts the data needed to create a row in the Personal Memory table
    :param file: The file being parsed. Each line in the file should consist of the following format:
        person:Persons Name,memory_file:The file name,caption:A caption for the memory

    File format example: person:Izzie,memory_file:Aug.3.2006.jpg,caption:The Day I met you.

    :return: returns the data extracted for the parsed file.
    """
    data = []
    for x in file:
        person = ''
        memory_file = ''
        caption = ''
        test = x.split(',')
        for data_field in test:
            if 'person' in data_field:
                person = data_field.split(':')[1]
            elif 'memory_file' in data_field:
                memory_file = data_field.split(':')[1]
            elif 'caption' in data_field:
                caption = data_field.split(':')[1]
        data.append({'person': person, 'memory_file': memory_file, 'caption': caption})
    return data


def main(memories_file, db):
    """
    Creates the three main tables
        memory: This table stores memories. A memory consists of:
            *id -PK
            *date_taken -text (The date the memory was captured)
            *memory_file -text (The file name for the image or video)
            *caption -a caption to go along with the memory
        people: This table stores people. People consists of:
            *id -PK
            *first_name -text
        memory_people: This is a ManyToMany table that has foreign keys to the memory table and the people table.
            *memory_id -INTEGER (foreign key to the memory table)
            *people_id -INTEGER (foreign key to the people table)
    :return: Does not return anything
    """
    database = db

    sql_create_memory_table = """ CREATE TABLE IF NOT EXISTS memory (
                                        id INTEGER PRIMARY KEY,
                                        date_taken text,
                                        memory_file text,
                                        caption text,
                                        CONSTRAINT file_unique UNIQUE (memory_file)
                                    );

    """
    sql_create_people_table = """ CREATE TABLE IF NOT EXISTS people (
                                        id INTEGER PRIMARY KEY,
                                        first_name text
                                    );

    """

    sql_create_memory_people_table = """ CREATE TABLE IF NOT EXISTS memory_people (
                                        memory_id INTEGER,
                                        people_id INTEGER,
                                        FOREIGN KEY(memory_id) REFERENCES memory(id),
                                        FOREIGN KEY(people_id) REFERENCES people(id)
                                    );

    """


    connection = create_connection(database)
    if connection is not None:
        # creates the memory table
        create_table(connection, sql_create_memory_table)
        # creates the people table
        create_table(connection, sql_create_people_table)
        # creates the memory_people table
        create_table(connection, sql_create_memory_people_table)
    else:
        print("Error! cannot create the database connection.")
    with connection:
        file = open(memories_file, "r")
        memory_people_data = getData(file)
        file.close()
        for data in memory_people_data:
            memory_id = create_memory(connection, data['date_taken'], data['video_title'])
            people_ids = create_people(connection, data['people'])
            if people_ids:
                create_memory_people(connection, memory_id, people_ids)
    connection.close()


def see_tables(table):
    """
    prints the data inside one of the tables
    :param table: the table being searched. Options: PEOPLE, MEMORIES, PEOPLE_MEMORIES, PERSONAL_MEMORIES
    :return: Does not return anything
    """
    print("SEE TABLES")
    database = "testparser.db"
    connection = create_connection(database)
    if table == PEOPLE:
        print("**********PEOPLE*****************")
        select_all_people(connection)
    if table == MEMORIES:
        print("**********Memories***************")
        select_all_memories(connection)
    if table == PEOPLE_MEMORIES:
        print("**********people_memories********")
        select_all_people_memories(connection)
    if table == PERSONAL_MEMORIES:
        print("**********PERSONAL MEMORIES**********")
        select_all_personal_memories(connection)
    connection.close()


def query_database_by_person(person):
    """
    Uses select_memory_person helper to query the database and get memories tied to a specific person
    :param person: the name of the person
    :return: the memory file names that has a reference to the person
    """
    database = "testparser.db"
    connection = create_connection(database)
    person_memory = select_memory_person(connection, person)
    print(person_memory)
    connection.close()
    return person_memory


def create_personal_memories(personal_memories_file, db):
    """
    Creates the personal memories tables.
    A Personal Memory is different from People Memories.
    These are memories that people submitted
    A Personal memory has the following fields:
        *id -PK
        *person -text (the name of the person who submitted the memory)
        *memory_file -text (the name of the file, has to be unique)
        *caption -text (caption to go along with the memory)
    :return: Does not return anything
    """
    database = "testparser.db"
    connection = create_connection(database)

    sql_create_personal_memory_table = """ CREATE TABLE IF NOT EXISTS personalMemory2 (
                                        id INTEGER PRIMARY KEY,
                                        person text,
                                        memory_file text,
                                        caption text,
                                        CONSTRAINT file_unique UNIQUE (memory_file)
                                    );

    """

    if connection is not None:
        # creates the memory table
        create_table(connection, sql_create_personal_memory_table)
    else:
        print("Error! cannot create the database connection.")
    with connection:
        file2 = open(personal_memories_file, 'r')
        person_memories = getPersonalMemoriesData(file2)
        file2.close()
        for memory in person_memories:
            create_personal_memory(connection, (memory['person'], memory['memory_file'], memory['caption'],))
    connection.close()

if __name__ == '__main__':
    main('video_title_2016.txt', "testparser.db")
    create_personal_memories("personal_memories.txt", "testparser.db")
