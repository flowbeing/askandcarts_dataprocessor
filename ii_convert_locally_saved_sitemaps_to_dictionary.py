import os
import json

from settings.q import default_folder_and_filename_settings as dffns


# CONVERT SITEMAPS' JSON WITHIN JSON FILE TO DICTIONARY
def convert_sitemap_json_to_dictionary(json_file_address, is_join_content=False):

    open_json_file = open(json_file_address, 'r')
    json_within_json_file = {}

    if is_join_content is False:
        json_within_json_file = open_json_file.readlines()[0]

    elif is_join_content is True:
        json_within_json_file = ''.join([i for i in open_json_file.readlines()])

    all_sitemaps_dict = json.loads(json_within_json_file)

    return all_sitemaps_dict


# OBTAIN AND SAVE ALL SITEMAPS AS PER TIME
def obtain_most_recent_all_sitemaps_filename(all_sitemaps_save_folder_location):

    # ALL FILES THAT EXIST WITHIN THE DEFAULT DIRECTORY FOR SAVING ALL SITEMAPS
    all_files_within_all_sitemaps_save_directory = os.listdir(all_sitemaps_save_folder_location)
    # print(all_files_within_all_sitemaps_save_directory)

    # CREATION TIME OF ALL FILES THAT EXIST WITHIN THE DEFAULT DIRECTORY FOR SAVING ALL SITEMAPS
    creation_time_of_all_files_within_all_sitemaps_save_directory = \
        [os.path.getmtime(all_sitemaps_save_folder_location + file_name) for file_name in
         all_files_within_all_sitemaps_save_directory]

    # print()
    # print(f'creation_time_of_all_files_within_all_sitemaps_save_directory: {creation_time_of_all_files_within_all_sitemaps_save_directory}' )
    # print()


    # A MAP OF ALL ALL FILES THAT EXIST WITHIN THE DEFAULT DIRECTORY FOR SAVING ALL SITEMAPS AS PER THEIR CREATION TIME
    files_within_all_sitemaps_save_directory_per_their_creation_time = {
        f'{creation_time:.5f}': file
        for creation_time, file in
        zip(creation_time_of_all_files_within_all_sitemaps_save_directory, all_files_within_all_sitemaps_save_directory)
    }

    # print(f'files_within_all_sitemaps_save_directory_per_their_creation_time: {files_within_all_sitemaps_save_directory_per_their_creation_time}')

    # MOST RECENT TO OLDEST SORTING OF CREATION TIME OF ALL FILES THAT EXIST WITHIN THE DEFAULT DIRECTORY FOR SAVING
    # ALL SITEMAPS
    creation_time_of_all_files_within_all_sitemaps_save_directory = sorted(creation_time_of_all_files_within_all_sitemaps_save_directory)
    # print()
    # print(f'creation_time_of_all_files_within_all_sitemaps_save_directory_sorted: {creation_time_of_all_files_within_all_sitemaps_save_directory}')

    # print(files_within_all_sitemaps_save_directory_per_their_creation_time)

    # CREATION TIME OF THE MOST RECENT FILE
    creation_time_of_most_recent_file_str = f'{creation_time_of_all_files_within_all_sitemaps_save_directory[-1]:.5f}'

    # print()
    # print(f'creation_time_of_most_recent_file: {creation_time_of_most_recent_file}')
    # print()

    # MOST RECENT FILE
    most_recent_all_sitemap_file_address = \
        all_sitemaps_save_folder_location + \
        files_within_all_sitemaps_save_directory_per_their_creation_time[creation_time_of_most_recent_file_str]
    return most_recent_all_sitemap_file_address

# MOST RECENT ALL SITEMAPS JSON FILE ADDRESS
most_recent_all_sitemaps_file_address = obtain_most_recent_all_sitemaps_filename(
    dffns.all_sitemaps_save_folder_location
)

# CONVERT THE MOST RECENT ALL SITEMAPS JSON TO DICTIONARY
# try:
#     most_recent_all_sitemap_as_dict = convert_sitemap_json_to_dictionary(
#         json_file_address = most_recent_all_sitemaps_file_address
#     )
# except:
#     most_recent_all_sitemap_as_dict = convert_sitemap_json_to_dictionary(
#         json_file_address=most_recent_all_sitemaps_file_address,
#         is_join_content=True
#     )

# ORIGIN SITEMAP(S) TO DICTIONARY
try:
    origin_sitemaps_as_dict = convert_sitemap_json_to_dictionary(
        json_file_address=dffns.origin_sitemaps_file_address
    )
except:
    origin_sitemaps_as_dict = convert_sitemap_json_to_dictionary(
        json_file_address=dffns.origin_sitemaps_file_address,
        is_join_content=True
    )


# print(most_recent_all_sitemap_as_dict)
# print()
# print(f'most_recent_all_sitemaps_file_address: {most_recent_all_sitemaps_file_address}')
# print()
# print(f'length of most_recent_all_sitemaps: {len(most_recent_all_sitemap_as_dict)}')